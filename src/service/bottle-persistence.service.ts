/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle} from '../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FilterSet} from '../components/distribution/distribution';
import {BottleFactory} from '../model/bottle.factory';
import {Loading, LoadingController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import {LoginService} from './login.service';
import {PersistenceService} from './persistence.service';
import {NotificationService} from './notification.service';
import {TranslateService} from '@ngx-translate/core';
import {FirebaseConnectionService} from './firebase-connection.service';
import Reference = firebase.database.Reference;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class BottlePersistenceService extends PersistenceService {
  private BOTTLES_ROOT: string;

  private cellarImported: boolean = false;
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _allBottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();
  private _filteredBottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _filteredBottlesObservable: Observable<Bottle[]> = this._filteredBottles.asObservable();
  private _filtersObservable: BehaviorSubject<FilterSet> = new BehaviorSubject<FilterSet>(new FilterSet());
  private filters: FilterSet = new FilterSet();
  private allBottlesArray: Bottle[];

  constructor(private bottleFactory: BottleFactory, private dataConnection: FirebaseConnectionService,
              loadingCtrl: LoadingController,
              notificationService: NotificationService,
              loginService: LoginService,
              translateService: TranslateService) {
    super(loadingCtrl, notificationService, loginService, translateService);
    if (loginService.user !== undefined) {
      this.initialize(loginService.user);
    } else {
      this.cleanup();
    }
  }

  initialize(user) {
    super.initialize(user);
    this.dataConnection.initialize(user);
    this.dataConnection.fetchAllBottles();
    this.fetchAllBottles();
  }

  cleanup() {
    super.cleanup();
    this.dataConnection.cleanup();
    this.BOTTLES_ROOT = undefined;
    this.allBottlesArray = undefined;
    this.filters = undefined;
  }

  public fetchAllBottles() {
    if (this.cellarImported) {
      this._bottles.next(this.allBottlesArray);
    } else {
      let items = this.dataConnection.allBottlesObservable;
      items.subscribe((bottles: Bottle[]) => {
                        bottles.forEach((bottle: Bottle) => this.bottleFactory.create(bottle));
                        this.setAllBottlesArray(bottles);
                        this.filterOn(this.filters);
                      },
                      error => this.notificationService.error('L\'accès à la liste des bouteilles a échoué !', error));
    }
  }

  public update(bottles: Bottle[]) {
    this.dataConnection.update(bottles).then(
      () => {
        //mise à jour faite
      },
      err => this.notificationService.failed('La mise à jour de la bouteille a échoué !', err)
    )
  }

  public save(bottles: Bottle[]) {
    this.dataConnection.save(bottles).then(
      () => this.notificationService.information('Sauvegarde effectuée'),
      err => this.notificationService.error('La sauvegarde a échoué !', err)
    );
  }

  public replaceBottle(bottle: Bottle) {
    this.dataConnection.replaceBottle(bottle).then(
      () => this.notificationService.information('Remplacement effectué'),
      err => this.notificationService.error('Le remplacement a échoué !', err)
    );
  }

  public deleteBottles() {
    this.dataConnection.deleteBottles().then(
      () => this.notificationService.information('Suppression effectuée'),
      error => this.notificationService.failed('La suppression des bouteilles a échoué', error)
    )
  }

  public initializeDB(bottles: Bottle[]) {
    this.save(bottles);
  }

  get allBottlesObservable(): Observable<Bottle[]> {
    return this._allBottlesObservable;
  }

  get filteredBottlesObservable(): Observable<Bottle[]> {
    return this._filteredBottlesObservable;
  }

  get filtersObservable(): Observable<FilterSet> {
    return this._filtersObservable.asObservable();
  }

  /**
   * Returns bottles that match ALL filters.
   * <li>all filters must be satisfied: filtered list is refined for each new filter</li>
   * <li>for each value in filter, applies a "OR" between accepted values</li>
   * @param filters
   * @returns {any}
   */
  public filterOn(filters: FilterSet, name?: string, order?: string): Bottle[] {

    if (!filters) {
      return;
    }
    if (this.allBottlesArray == undefined) {
      return;
    }

    let filtered = this.allBottlesArray;
    if (!filters.isEmpty()) {
      if (!filters.searchHistory()) {
        filtered = filtered.filter(btl => +btl.quantite_courante > 0);
      }
      //ne garder que les bouteilles favorites, sinon toutes
      if (filters.searchFavoriteOnly()) {
        filtered = filtered.filter(btl => btl.favorite);
      }
      // always start filtering using textual search
      if (filters.hasText()) {
        filtered = this.getBottlesByKeywords(filtered, filters.text);
      }

      // on hierarchical axis like regions and ages, use most precise filter if available
      if (filters.hasMillesimes()) {
        filtered = this.filterByAttribute(filtered, 'millesime', filters.millesime);
      } else {
        // if filtering on millesime no need to filter on ages (matching millesime implies matching ages slice)
        if (filters.hasAges()) {
          filtered = this.filterByAttribute(filtered, 'classe_age', filters.classe_age);
        }
      }

      // on hierarchical axis like regions and ages, use most precise filter if available
      if (filters.hasAppellations()) {
        filtered = this.filterByAttribute(filtered, 'area_label', filters.area_label);
      } else {
        // if filtering on area_label no need to filter on region (matching area_label implies matching subregion_label)
        if (filters.hasRegions()) {
          filtered = this.filterByAttribute(filtered, 'subregion_label', filters.subregion_label);
        }
      }

      if (filters.hasCouleurs()) {
        filtered = this.filterByAttribute(filtered, 'label', filters.label);
      }
    }
    if (name) {
      filtered = _.orderBy(filtered, [ name ], [ order == undefined ? 'asc' : order ]);
    }
    this.setFilters(filters);

    this._filteredBottles.next(filtered);
  }

  private setAllBottlesArray(bottles: Bottle[]) {
    this.allBottlesArray = bottles;
    this._bottles.next(bottles);
  }

  /**
   * searches through the given bottles all that match all of the filters passed in
   * @param fromList array of bottles
   * @param keywords an array of searched keywords
   * @returns array of matching bottles
   */
  private getBottlesByKeywords(fromList: Bottle[], keywords: string[]): any {
    if (!keywords || keywords.length == 0) {
      return fromList;
    }
    let filtered = fromList;
    keywords.forEach(keyword => {
      filtered = this.filterOnKeyword(filtered, keyword);
    });

    return filtered;
  }

  /**
   * get the bottles which match one keyword
   * @param list
   * @param keyword
   * @returns {any[]}
   */
  private filterOnKeyword(list: any[], keyword: string) {
    let keywordLower = keyword.toLocaleLowerCase();
    return list.filter(bottle => {
                         let matching = false;
                         for (let key in bottle) {
                           if (bottle[ key ].toString().toLocaleLowerCase().indexOf(keywordLower) !== -1) {
                             matching = true;
                           }
                         }
                         return matching;
                       }
    );
  }

  private filterByAttribute(fromList: Bottle[ ], attribute: string, admissibleValues: string[ ]) {
    return fromList.filter(bottle => {
      let ret = true;
      let attrValue = bottle[ attribute ].toString();
      //admissibleValues.forEach(admissibleValue => ret = ret && attrValue.indexOf(admissibleValue) !== -1);
      return admissibleValues.indexOf(attrValue) !== -1;
    })
  }

  private setFilters(filters: FilterSet) {
    this.filters = filters;
    this._filtersObservable.next(filters);
  }

  public setCellarContent(bottles: Bottle[]) {
    this.cellarImported = true;
    this.allBottlesArray = bottles;
    this._bottles.next(this.allBottlesArray);
  }
}



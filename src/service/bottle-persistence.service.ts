/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle} from '../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FilterSet} from '../components/distribution/distribution';
import {Platform} from 'ionic-angular';
import * as _ from 'lodash';
import {LoginService} from './login.service';
import {PersistenceService} from './persistence.service';
import {NotificationService} from './notification.service';
import {FirebaseConnectionService, SearchCriteria} from './firebase-connection.service';
import {User} from '../model/user';
import {Subscription} from 'rxjs/Subscription';
import {Locker} from '../model/locker';
import {TranslateService} from '@ngx-translate/core';
import {BottleFactory} from '../model/bottle.factory';
import {Subject} from 'rxjs/Subject';
import {BottleNoting} from '../components/bottle-noting/bottle-noting.component';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class BottlePersistenceService extends PersistenceService {
  private BOTTLES_ROOT: string;

  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _allBottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();
  private _filteredBottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _filteredBottlesObservable: Observable<Bottle[]> = this._filteredBottles.asObservable();
  private _filtersObservable: BehaviorSubject<FilterSet>;
  private filters: FilterSet = new FilterSet(this.translateService);
  private allBottlesArray: Bottle[];
  private dataConnectionSub: Subscription;

  constructor(private dataConnection: FirebaseConnectionService,
              notificationService: NotificationService,
              loginService: LoginService, private bottleFactory: BottleFactory,
              translateService: TranslateService,
              private platform: Platform) {
    super(notificationService, loginService, translateService);
    this._filtersObservable = new BehaviorSubject<FilterSet>(new FilterSet(this.translateService));
    if (loginService.user) {
      this.initialize(loginService.user);
    }
  }

  protected initialize(user: User) {
    super.initialize(user);
    this.dataConnection.initialize(user);
    let items = this.dataConnection.allBottlesObservable;
    this.dataConnectionSub = items.subscribe((bottles: Bottle[]) => {
                                               this.setAllBottlesArray(bottles);
                                               this.filterOn(this.filters);
                                             },
                                             error => this.notificationService.error('L\'accès à la liste des bouteilles a échoué !', error));
    this.dataConnection.fetchAllBottles();
  }

  protected cleanup() {
    super.cleanup();
    this.dataConnectionSub.unsubscribe();
    this.dataConnection.cleanup();
    this.BOTTLES_ROOT = undefined;
    this.allBottlesArray = undefined;
    this.filters = undefined;
  }

  public update(bottles: Bottle[]) {
    this.dataConnection.update(bottles.map((btl: Bottle) => {
      btl.lastUpdated = new Date().getTime();
      btl.positions = btl.positions.filter(pos => pos.lockerId !== undefined);
      delete btl.selected;
      return btl;
    })).then(
      () => {
        () => this.notificationService.information('update.saved')
        err => this.notificationService.failed('update.failed', err)
      },
    )
  }

  public updateLockerAndBottles(bottles: Bottle[], locker: Locker) {
    this.dataConnection.updateLockerAndBottles(bottles, locker)
      .then(
        () => this.notificationService.information('update.saved'),
        err => this.notificationService.failed('update.failed', err)
      )
  }

  public save(bottles: Bottle[]): Promise<any> {
    return this.dataConnection.saveBottles(bottles);
  }

  public deleteBottles() {
    this.dataConnection.deleteBottles().then(
      () => this.notificationService.information('Suppression effectuée'),
      error => this.notificationService.failed('La suppression des bouteilles a échoué', error)
    )
  }

  public getBottle(id: string): Bottle {
    return this.allBottlesArray.find(btl => btl.id === id);
  }

  public getBottlesInLocker(locker: Locker): Bottle[] {
    return this.allBottlesArray.filter(
      bottle => bottle.positions.filter(pos => pos.lockerId === locker.id).length > 0
    )
  }

  /**
   * creates a clean bottle starting from any bottle-like structured Data
   * @param {Bottle} btl
   * @returns {Bottle}
   */
  public createBottle(btl: Bottle): Bottle {
    return this.bottleFactory.create(btl)
  }

  public disconnectListeners() {
    this.dataConnection.disconnectListeners();
  }

  public reconnectListeners() {
    this.dataConnection.reconnectListeners();
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
  public filterOn(filters: FilterSet): Bottle[] {

    if (!filters) {
      return;
    }
    if (this.allBottlesArray == undefined) {
      return;
    }

    let filtered = this.allBottlesArray;
    if (!filters.isEmpty()) {
      if (!filters.history) {
        filtered = filtered.filter(btl => +btl.quantite_courante > 0);
      }
      //ne garder que les bouteilles favorites, sinon toutes
      if (filters.overdueOnly) {
        filtered = filtered.filter(btl => btl.overdue);
      }
      //ne garder que les bouteilles favorites, sinon toutes
      if (filters.favoriteOnly) {
        filtered = filtered.filter(btl => btl.favorite);
      }
      // always start filtering using textual search
      if (filters.hasText()) {
        filtered = this.getBottlesByKeywords(filtered, filters.text);
      }

      // don't show placed bottles
      if (!filters.placed) {
        //on ne garde que les bouteilles non totalement placées
        filtered = filtered.filter(btl => btl.positions.length !== +btl.quantite_courante)
      }

      // show not placed bottles
      if (!filters.toBePlaced) {
        //on ne garde que les bouteilles totalement placées
        filtered = filtered.filter(btl => btl.positions.length === +btl.quantite_courante)
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
    if (filters.sortOption) {
      filtered = _.orderBy(filtered, [ filters.sortOption.sortOn ], [ filters.sortOption.sortOrder == undefined ? 'asc' : filters.sortOption.sortOrder ]);
    }
    this.setFilters(filters);

    this._filteredBottles.next(filtered);
  }

  getMostUsedQueries(nb: number = 5): Observable<SearchCriteria[]> {
    return this.dataConnection.getMostUsedQueries(nb);
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
    keywords = keywords.map(
      kw => {
        return kw.trim().toLowerCase()
      }
    );
    keywords = keywords.sort();
    this.dataConnection.updateQueryStats(keywords);
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
                           let value = bottle[ key ] ? bottle[ key ].toString() : '';
                           if (value.toLocaleLowerCase().indexOf(keywordLower) !== -1) {
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
      let attrValue = bottle[ attribute ] ? bottle[ attribute ].toString() : '';
      //admissibleValues.forEach(admissibleValue => ret = ret && attrValue.indexOf(admissibleValue) !== -1);
      return admissibleValues.indexOf(attrValue) !== -1;
    })
  }

  private setFilters(filters: FilterSet) {
    this.filters = filters;
    this._filtersObservable.next(filters);
  }

  removeFromQueryStats(keywords: any) {
    this.dataConnection.removeFromQueryStats(keywords);
  }

  deleteAccountData(): Observable<boolean> {
    let sub = new Subject<boolean>();
    this.notificationService.ask('question', 'app.keep-or-delete-data').take(1).subscribe(
      resp => {
        if (resp) {
          this.dataConnection.deleteAccount().take(1).subscribe(
            result => sub.next(result)
          )
        }
      }
    );
    return sub.asObservable();
  }

  withdraw(bottle: Bottle) {
    this.notificationService.information('La bouteille ' + bottle.nomCru + ' a été retirée et ajoutée au sorties');
  }

  recordNotation(bottle: Bottle, notes: BottleNoting) {
    this.notificationService.information('quality:' + notes.quality.note + '\nmaturity:' + notes.maturity.note + '\npleasurePrice:' +
      notes.pleasurePrice.note + '\ncomments:' + notes.comments);
  }
}



/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle} from './bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FilterSet} from '../distribution/distribution';
import {AngularFireDatabase} from 'angularfire2/database';
import {BottleFactory} from '../../model/bottle.factory';
import {AlertController, Loading, LoadingController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import Reference = firebase.database.Reference;
import {LoginService} from '../../pages/home/login.service';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class BottleService {
  private firebaseRef: Reference;
  private cellarImported: boolean = false;
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _allBottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();
  private _filteredBottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _filteredBottlesObservable: Observable<Bottle[]> = this._filteredBottles.asObservable();
  private _filtersObservable: BehaviorSubject<FilterSet> = new BehaviorSubject<FilterSet>(new FilterSet());
  private filters: FilterSet = new FilterSet();
  private allBottlesArray: Bottle[];
  private loading: Loading;

  constructor(private bottleFactory: BottleFactory, private firebase: AngularFireDatabase,
              private loadingCtrl: LoadingController, private alertController: AlertController,
              private loginService: LoginService) {
    this.firebaseRef = this.firebase.database.ref('users/' + this.loginService.getCellarExplorerUserId() + '/bottles');
    this.fetchAllBottles();
  }

  public fetchAllBottles() {
    if (this.cellarImported) {
      this._bottles.next(this.allBottlesArray);
    } else {
      this.showLoading();
      let items = this.firebase.list('users' + this.loginService.getCellarExplorerUserId() + 'bottles', {
        query: {
          limitToFirst: 1000,
          orderByChild: 'quantite_courante',
          startAt: '0'
        }
      });
      items.subscribe((bottles: Bottle[]) => {
        bottles.forEach((bottle: Bottle) => this.bottleFactory.create(bottle));
        this.setAllBottlesArray(bottles);
        this.filterOn(this.filters);
        this.dismissLoading();
      });
    }
  }

  public save(bottles: Bottle[]) {
    bottles.forEach(bottle => this.firebaseRef.push(bottle));
  }

  public replaceBottle(bottle: Bottle) {
    //let ref = this.firebase.database.ref('users/loicsalou/bottles/bottle');
    //ref.
    this.firebaseRef.child(bottle[ '$key' ])
      .set(bottle,
           err => {
             if (err) {
               this.alertController.create({
                                             title: 'Echec',
                                             subTitle: '_La sauvegarde a échoué ! ' + err,
                                             buttons: [ 'Ok' ]
                                           }).present()
             }
           });
  }

  public initializeDB(bottles: Bottle[]) {
    this.firebaseRef.remove();
    bottles.forEach(bottle => this.firebaseRef.push(bottle));
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
    //console.info(Date.now()+" - filtering on "+filters.toString());
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

  private showLoading() {
    if (this.loading == undefined) {
      this.loading = this.loadingCtrl.create({
                                               content: 'Chargement en cours...',
                                               dismissOnPageChange: false
                                             });
      this.loading.present();
    }
  }

  private dismissLoading() {
    if (this.loading != undefined) {
      this.loading.dismiss();
      this.loading = undefined;
    }
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
                         for (var key in bottle) {
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
      admissibleValues.forEach(admissibleValue => ret = ret && attrValue.indexOf(admissibleValue) !== -1);
      return ret;
    })
  }

  //private getAuth(): AuthConfiguration {
  //  let me: AuthConfiguration = {
  //    method: AuthMethods.Anonymous, provider: AuthProviders.Anonymous
  //  };
  //
  //  return me;
  //}

  handleError(error: any) {
    this.alertController.create({
                                  title: 'Erreur !',
                                  subTitle: 'Une erreur s\'est produite ! ' + error,
                                  buttons: [ 'Ok' ]
                                })
    return Observable.throw(error.json().error || 'Server error');
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



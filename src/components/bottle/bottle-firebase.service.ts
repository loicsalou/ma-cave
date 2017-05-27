/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from "@angular/core";
import {Bottle} from "./bottle";
import * as _ from "lodash";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {FilterSet} from "../distribution/distribution";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {BottleFactory} from "../../model/bottle.factory";
import {Subject} from "rxjs/Subject";

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class BottleService {
  private _bottles: Subject<Bottle[]> = new Subject<Bottle[]>();
  private _bottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();
  private _filtersObservable: Subject<FilterSet> = new Subject<FilterSet>();
  private filters: FilterSet;
  private bottlesArray: Bottle[];

  constructor(private bottleFactory: BottleFactory, private firebase: AngularFireDatabase,
              private firebaseAuth: AngularFireAuth) {
    this.firebaseAuth.auth.signInAnonymously().catch((a: Error) =>
                                                       console.error("login failed: " + a)
    );
    this.setFilters(new FilterSet());
    this.fetchAllBottles();
  }

  public fetchAllBottles() {
    console.info(Date.now()+" - fetching all bottles");

    this.firebase.list('/bottles').subscribe((bottles: Bottle[]) => {
      bottles.forEach((bottle: Bottle) => this.bottleFactory.create(bottle));
      this.bottlesArray = bottles;
      this._bottles.next(bottles);
      this.filters.reset();
    });
  }

  get bottlesObservable(): Observable<Bottle[]> {
    return this._bottlesObservable;
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
  public filterOn(filters: FilterSet) {
    console.info(Date.now()+" - filtering on "+filters.toString());

    if (this.bottlesArray==undefined) {
      return;
    }
    if (filters.isEmpty()) {
      this._bottles.next(this.bottlesArray);
    }

    let filtered = this.bottlesArray;
    // always start filtering using textual search
    if (filters.hasText()) {
      filtered = this.getBottlesByKeywords(this.bottlesArray, filters.text);
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

    this.setFilters(filters);
    this._bottles.next(filtered);
  }

  /**
   * searches through the given bottles all that match all of the filters passed in
   * @param fromList array of bottles
   * @param keywords an array of searched keywords
   * @returns array of matching bottles
   */
  private getBottlesByKeywords(fromList: Bottle[], keywords: string[]): any {
    if (!keywords || keywords.length == 0) {
      return this._bottles;
    }
    let filtered = this.bottlesArray;
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
    return list.filter(bottle => {
                         let matching = false;
                         for (var key in bottle) {
                           if (bottle[ key ].toString().toLocaleLowerCase().indexOf(keyword) !== -1) {
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

  private static isEmpty(array: any[ ], index: number): boolean {
    return _.isEmpty(array, index);
  }

  private bottleMatchesAll(matches: any, keywords: string[ ]) {
    let ret = true;
    keywords.forEach(token =>
                       ret = ret && matches[ token ]);
    return ret;
  }

  handleError(error: any) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  private setFilters(filters: FilterSet) {
    this.filters=filters;
    this._filtersObservable.next(filters);
  }
}

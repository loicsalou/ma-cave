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

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class BottleService {
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  bottles: Observable<Bottle[]> = this._bottles.asObservable();
  bottlesArray: Bottle[];

  currentYear = new Date().getFullYear();
  private start: number = 0;

  constructor(private i18n: TranslateService, private http: Http, private firebase: AngularFireDatabase, private firebaseAuth: AngularFireAuth) {
    this.firebaseAuth.auth.signInAnonymously().catch((a: Error) =>
                                                       console.error("login failed: "+ a)
    );
    this.fetchAllBottles();
  }

  private setClasseAge(bottle: Bottle) {
    if (bottle.millesime === '-') {
      bottle[ 'classe_age' ] = this.i18n.instant('no-age');
      return;
    }
    let mill = Number(bottle.millesime);
    if (mill + 4 > this.currentYear) {
      bottle[ 'classe_age' ] = this.i18n.instant('young');
    }
    if (mill + 10 > this.currentYear) {
      bottle[ 'classe_age' ] = this.i18n.instant('middle');
    }
    if (mill + 15 > this.currentYear) {
      bottle[ 'classe_age' ] = this.i18n.instant('old');
    }
    bottle[ 'classe_age' ] = this.i18n.instant('very-old');
  }

  /**
   * searches through the given bottles all that match all of the filter{s passed in
   * @param fromList array of bottles
   * @param keywords an array of searched keywords
   * @returns array of matching bottles
   */
  //public getBottlesByFilter(filters: FilterSet): any {
  //  if (filters.isEmpty()) {
  //    this.fetchAllBottles();
  //    return;
  //  }
  //  this.firebase.list('/bottles', {
  //    query: {
  //      equalTo: filters.label[0],
  //      orderByChild: 'label',
  //      limitToFirst: 5
  //    }
  //  }).subscribe((bottles: Bottle[]) => {
  //    bottles.forEach((bottle: Bottle) => this.setClasseAge(bottle));
  //    this._bottles.next(bottles);
  //    this.getRestOfBottlesByFilter(filters).subscribe((bottles: Bottle[]) => {
  //      bottles.forEach((bottle: Bottle) => this.setClasseAge(bottle));
  //      this._bottles.next(bottles);
  //    });
  //  });
  //}
  //
  //private getRestOfBottlesByFilter(filters: FilterSet) {
  //  return this.firebase.list('/bottles', {
  //    query: {
  //      equalTo: filters.label,
  //      orderByChild: 'label'
  //    }
  //  });
  //}

  /**
   * searches through the given bottles all that match all of the filters passed in
   * @param fromList array of bottles
   * @param keywords an array of searched keywords
   * @returns array of matching bottles
   */
  public getBottlesByKeywords(fromList: Bottle[], keywords: string[]): any {
    if (!keywords || keywords.length == 0) {
      return this.bottles;
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

  /**
   * Returns bottles that match ALL filters.
   * <li>all filters must be satisfied: filtered list is refined for each new filter</li>
   * <li>for each value in filter, applies a "OR" between accepted values</li>
   * @param filters
   * @returns {any}
   */
  public getBottlesByFilter(filters: FilterSet): Bottle[] {
    if (filters.isEmpty()) {
      return this.bottlesArray;
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

    return filtered;
  }

  private filterByAttribute(fromList: Bottle[ ], attribute: string, admissibleValues: string[ ]) {
    return fromList.filter(bottle => {
      let ret = true;
      let attrValue = bottle[ attribute ].toString();
      admissibleValues.forEach(admissibleValue => ret = ret && attrValue.indexOf(admissibleValue) !== -1);
      return ret;
    })
  }

  getBottlesObservable(): Observable<Bottle[]> {
    return this.bottles;
  }

  fetchAllBottles() {
    this.firebase.list('/bottles').subscribe((bottles: Bottle[]) => {
      bottles.forEach((bottle: Bottle) => this.setClasseAge(bottle));
      this.bottlesArray = bottles;
      this._bottles.next(bottles);
    });
  }

  //private getAuth(): AuthConfiguration {
  //  let me: AuthConfiguration = {
  //    method: AuthMethods.Anonymous, provider: AuthProviders.Anonymous
  //  };
  //
  //  return me;
  //}

  /*
   getBottlesObservable(searchParams ?: any): Observable<Bottle[ ]> {
   if (!
   searchParams
   ) {
   return this.getAllBottlesObservable();
   }

   let filtered = [];

   this.getAllBottlesObservable().subscribe(
   (filtered: Bottle[]) => filtered.filter(
   bottle => {
   if (searchParams.subregion_label && searchParams.subregion_label.length > 0) {
   let regionCode = Configuration.regionsText2Code[ bottle[ 'subregion_label' ] ];
   return searchParams.subregion_label.indexOf(regionCode) != -1;
   } else {
   return true;
   }
   }).filter(bottle => {
   if (searchParams.colors && searchParams.colors.length > 0) {
   let colorCode = Configuration.colorsText2Code[ bottle[ 'label' ] ];
   return searchParams.colors.indexOf(colorCode) != -1;
   } else {
   return true;
   }
   }));

   return Observable.create((observer: Observer<Bottle[]>) => {
   observer.next(filtered);
   });

   }
   */
  //private
  handleError(error: any) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  static
  isEmpty(array: any[ ], index: number): boolean {
    return _.isEmpty(array, index);
  }

  /*
   getBottlesBy(bottles: Bottle[ ], by: string, value: any) {
   let filtered = bottles.filter(bottle => {
   let field = bottle[ by ];
   if (typeof field === 'number') {
   return field === +value;
   } else {
   return field === value;
   }
   });
   return filtered;
   }
   */
  private
  bottleMatchesAll(matches: any, keywords: string[ ]) {
    let ret = true;
    keywords.forEach(token =>
                       ret = ret && matches[ token ]);
    return ret;
  }
}

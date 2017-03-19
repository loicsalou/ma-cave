/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from "@angular/core";
import {Bottle} from "./bottle";
import * as _ from "lodash";
import {Configuration} from "../config/Configuration";
import {TranslateService} from "@ngx-translate/core";
import {Observable, Observer} from "rxjs";
import {Http, Response} from "@angular/http";
import {FilterSet} from "../distribution/distribution";

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class BottleService {
  bottles = require('../../assets/json/ma-cave.json');
  currentYear = new Date().getFullYear();

  constructor(private i18n: TranslateService, private http: Http) {
    this.bottles.map((btl: Bottle) => btl[ 'classe_age' ] = this.setClasseAge(btl[ 'millesime' ]));
  }

  private setClasseAge(millesime: any) {
    if (millesime === '-') {
      return this.i18n.instant('no-age');
    }
    if (millesime + 4 > this.currentYear) {
      return this.i18n.instant('young');
    }
    if (millesime + 10 > this.currentYear) {
      return this.i18n.instant('middle');
    }
    if (millesime + 15 > this.currentYear) {
      return this.i18n.instant('old');
    }
    return this.i18n.instant('very-old');
  }

  getBottlesByKeywords(fromList: Bottle[], keywords: string[]): any {
    if (!keywords || keywords.length == 0) {
      return this.bottles;
    }

    let search = keywords[ 0 ].toLowerCase();
    return this.bottles.filter((bottle) => {
                                 let ret = false;
                                 let matches = {};
                                 for (var key in bottle) {
                                   var attrValue = bottle[ key ].toString().toLocaleLowerCase();
                                   if (!attrValue) {
                                     continue;
                                   }
                                   for (var i = 0; i < keywords.length; i++) {
                                     let token = keywords[ i ].toLocaleLowerCase();

                                     if (attrValue.indexOf(token) != -1) {
                                       matches[ token ] = true;
                                       if (this.bottleMatchesAll(matches, keywords)) {
                                         ret = true;
                                         break;
                                       }
                                     }
                                   }
                                 }

                                 return ret;
                               }
    );

  }

  //returns bottles that match ALL filters.
  //for each filter applies a "OR" between accepted values
  getBottlesByFilter(filters: FilterSet): any {
    if (filters.isEmpty()) {
      return this.bottles;
    }

    let filtered = this.bottles;
    if (filters.hasText()) {
      filtered = this.getBottlesByKeywords(this.bottles, filters.text);
    }

    if (filters.hasMillesimes()) {
      filtered = this.filterByAttribute(filtered, 'millesime', filters.millesime);
    } else {
      if (filters.hasAges()) {
        filtered = this.filterByAttribute(filtered, 'classe_age', filters.classe_age);
      }
    }

    if (filters.hasAppellations()) {
      filtered = this.filterByAttribute(filtered, 'area_label', filters.area_label);
    } else {
      if (filters.hasRegions()) {
        filtered = this.filterByAttribute(filtered, 'subregion_label', filters.subregion_label);
      }
    }

    if (filters.hasCouleurs()) {
      filtered = this.filterByAttribute(filtered, 'label', filters.label);
    }

    return filtered;
  }

  private filterByAttribute(fromList: Bottle[], attribute: string, admissibleValues: string[]) {
    return fromList.filter(bottle => {
      let ret = true;
      let attrValue = bottle[ attribute ].toString();
      admissibleValues.forEach(admissibleValue => ret = ret && attrValue.indexOf(admissibleValue) !== -1);
      return ret;
    })
  }

  getBottles(searchParams ?: any): any {
    if (!searchParams) {
      return this.bottles;
    }

    let filtered = this.bottles;
    if (searchParams.subregion_label && searchParams.subregion_label.length > 0) {
      filtered = filtered.filter((bottle) => {
        let regionCode = Configuration.regionsText2Code[ bottle.subregion_label ];
        return searchParams.subregion_label.indexOf(regionCode) != -1;
      })
    }

    if (searchParams.colors && searchParams.colors.length > 0) {
      filtered = filtered.filter((bottle) => {
        let colorCode = Configuration.colorsText2Code[ bottle.label ];
        return searchParams.colors.indexOf(colorCode) != -1;
      })
    }

    return filtered;
  }

  getAllBottlesObservable(): Observable < Bottle[ ] > {
    return this.http.get('/assets/json/ma-cave.json')
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getBottlesObservable(searchParams ?: any): Observable < Bottle[ ] > {
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

  private handleError(error: any) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  static isEmpty(array: any[ ], index: number): boolean {
    return _.isEmpty(array, index);
  }

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

  private bottleMatchesAll(matches: any, keywords: string[]) {
    let ret = true;
    keywords.forEach(token =>
                       ret = ret && matches[ token ]);
    return ret;
  }
}

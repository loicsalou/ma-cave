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

/**
 * Services related to the bottles in the cellar.
 * The regions below are duplicated in the code of france.component.html as they are emitted when end-user clicks on
 * a region to filter bottles. Any change on either side must be propagated on the other side.
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

  getBottlesByKeywords(keywords: string[]): any {
    if (!keywords || keywords.length == 0 || !keywords[ 0 ]) {
      return this.bottles;
    }

    let search = keywords[ 0 ].toLowerCase();
    return this.bottles.filter((bottle) => {
      let ret = false;
      for (var key in bottle) {
        var attrValue = bottle[ key ].toString().toLocaleLowerCase();

        if (attrValue && attrValue.indexOf(search) != -1) {
          ret = true;
          break;
        }
      }

      return ret;
    });

  }

  getBottles(searchParams?: any): any {
    if (!searchParams) {
      return this.bottles;
    }
    //Bottle.showDistinctColors();
    //Bottle.showDistinctRegions();

    let filtered = this.bottles;
    if (searchParams.regions && searchParams.regions.length > 0) {
      filtered = filtered.filter((bottle) => {
        let regionCode = Configuration.regionsText2Code[ bottle.subregion_label ];
        return searchParams.regions.indexOf(regionCode) != -1;
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

  getAllBottlesObservable(): Observable<Bottle[]> {
    return this.http.get('/assets/json/ma-cave.json')
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getBottlesObservable(searchParams?: any): Observable<Bottle[]> {
    if (!searchParams) {
      return this.getAllBottlesObservable();
    }

    let filtered = [];

    this.getAllBottlesObservable().subscribe(
      (filtered: Bottle[]) => filtered.filter(
        bottle => {
          if (searchParams.regions && searchParams.regions.length > 0) {
            let regionCode = Configuration.regionsText2Code[ bottle[ 'subregion_label' ] ];
            return searchParams.regions.indexOf(regionCode) != -1;
          } else {
            return true;
          }
        }).filter(bottle => {
        if (searchParams.colors && searchParams.colors.length > 0) {
          let colorCode = Configuration.colorsText2Code[ bottle['label'] ];
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
}

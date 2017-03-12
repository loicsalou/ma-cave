/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from "@angular/core";
import {Bottle} from "./bottle";
import * as _ from "lodash";
import {Configuration} from "../config/Configuration";

/**
 * Services related to the bottles in the cellar.
 * The regions below are duplicated in the code of france.component.html as they are emitted when end-user clicks on
 * a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class BottleService {
  bottles = require('../../assets/json/ma-cave.json');

  getBottlesByKeywords(keywords: string[]): any {
    if (!keywords || keywords.length == 0 || !keywords[0])
      return this.bottles;

    let search = keywords[0].toLowerCase();
    return this.bottles.filter((bottle) => {
      let ret = false;
      for (var key in bottle) {
        var attrValue = bottle[key].toString().toLocaleLowerCase();

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
        let regionCode = Configuration.regionsText2Code[bottle.subregion_label];
        return searchParams.regions.indexOf(regionCode) != -1;
      })
    }

    if (searchParams.colors && searchParams.colors.length > 0) {
      filtered = filtered.filter((bottle) => {
        let colorCode = Configuration.colorsText2Code[bottle.label];
        return searchParams.colors.indexOf(colorCode) != -1;
      })
    }

    return filtered;
  }

  static isEmpty(array: any[], index: number): boolean {
    return _.isEmpty(array, index);
  }

  getBottlesBy(bottles: Bottle[], by: string, value: any) {

    let filtered = bottles.filter(bottle => bottle[by] === value);
    return filtered;

  }
}


// WEBPACK FOOTER //
// ./src/pages/browse/bottle.service.ts

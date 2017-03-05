/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from "@angular/core";
import {Bottle} from "./bottle";

/**
 * Services related to the bottles in the cellar.
 * The regions below are duplicated in the code of france.component.html as they are emitted when end-user clicks on
 * a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class BottleService {
  bottles = require('../../assets/json/ma-cave.json');

  getBottles(searchParams?: any): any {
    if (!searchParams) {
      return this.bottles;
    }
    //Bottle.showDistinctColors();
    //Bottle.showDistinctRegions();

    let filtered = this.bottles;
    if (searchParams.regions && searchParams.regions.length>0) {
      filtered = filtered.filter((bottle) => {
        let regionCode = Bottle.regions2[bottle.subregion_label];
        return searchParams.regions.indexOf(regionCode) != -1;
      })
    }

    if (searchParams.colors && searchParams.colors.length>0) {
      filtered = filtered.filter((bottle) => {
        let colorCode = Bottle.colors2[bottle.label];
        return searchParams.colors.indexOf(colorCode) != -1;
      })
    }

    return filtered;
  }

}

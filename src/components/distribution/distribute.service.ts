/**
 * Created by loicsalou on 07.03.17.
 */
import {Injectable} from "@angular/core";

/**
 * Services related to the bottles in the cellar.
 * The regions below are duplicated in the code of france.component.html as they are emitted when end-user clicks on
 * a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class DistributeService {

  distributeBy(rows: any[], byCols: string[]): any[] {
    let distribution = [];

    byCols.forEach(col => {
      let r = this.reduceToCount(rows, col);
      distribution.push(r);
    });

    return distribution;
  }

  private reduceToCount(rows: any[], col: string): any {
    var occurences = rows.reduce(function (r, row) {
      r[row[col]] = ++r[row[col]] || 1;
      return r;
    }, {});

    var result = Object.keys(occurences).map(function (key) {
      return { key: key, value: occurences[key] };
    });

    console.log(result);
    return result;
  }

/*  distributeBy(collection: any[], byCols: string[]): any[] {
    let distribution = [];

    return byCols.map(col => {
      let r = this.reduceToCount(collection, col);
      return r;
    });
  }

  private reduceToCount(collection: any[], col: string): any {
    let counts = {};
    return collection.forEach(item => {
      let colValue = item[col];
      counts[colValue] = ++counts[colValue] || 1;
    })
    return counts;
  }
  */
}

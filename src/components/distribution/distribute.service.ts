/**
 * Created by loicsalou on 07.03.17.
 */
import {Injectable} from '@angular/core';
import * as _ from 'lodash';

/**
 * Services related to the bottles in the cellar.
 * This service is responsible for distributing an array of rows among attributes.
 * The goal is to know, for each distinct attribute value which is asked, how many rows have the same value.
 * Example:
 * given an array of bottles, and the array ['label', 'subregion_label', 'classe_age'] we can get
 * <li>{ label: {'rouge': 261, 'blanc': 250, 'blanc liquoreux': 27 etc.}}</li>
 * <li>{ subregion_label: {'bourgogne': 123, 'bordeaux': 220, 'Val de Loire': 72 etc.}}</li>
 * <li>{ classe_age: {'jeune': 123, 'moyen': 220, 'vieux': 120, 'très vieux': 25 etc.}}</li>
 *
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class DistributeService {

  /**
   * Distribute rows per attibute value
   * @param rows: array of objects to distribute
   * @param byCols array of columns in the objects: object must provide values for these attributes
   * @returns {Array}
   */
  distributeBy(rows: any[], byCols: string[]): Distribution[] {
    if (rows == null) {
      return null;
    }
    let distribution = [];

    byCols.forEach(col => {
      let r = this.reduceToCount(rows, col);
      r = _.sortBy(r, item => item.value);
      r = _.reverse(r);
      distribution.push({axis: col, values: r});
    });

    return distribution;
  }

  private reduceToCount(rows: any[], col: string): KeyValue[] {
    var occurences = rows.reduce(function (r, row) {
      r[ row[ col ] ] = ++r[ row[ col ] ] || 1;
      return r;
    }, {});

    var result = Object.keys(occurences).map(function (key) {
      return {key: key, value: occurences[ key ]};
    });

    return result;
  }
}

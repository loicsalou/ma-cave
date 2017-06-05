var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by loicsalou on 07.03.17.
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
/**
 * Services related to the bottles in the cellar.
 * This service is responsible for distributing an array of rows among attributes.
 * The goal is to know, for each distinct attribute value which is asked, how many rows have the same value.
 * Example:
 * given an array of bottles, and the array ['label', 'subregion_label', 'class_age'] we can get
 * <li>{ label: {'rouge': 261, 'blanc': 250, 'blanc liquoreux': 27 etc.}}</li>
 * <li>{ subregion_label: {'bourgogne': 123, 'bordeaux': 220, 'Val de Loire': 72 etc.}}</li>
 * <li>{ class_age: {'jeune': 123, 'moyen': 220, 'vieux': 120, 'très vieux': 25 etc.}}</li>
 *
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
var DistributeService = (function () {
    function DistributeService() {
    }
    /**
     * Distribute rows per attibute value
     * @param rows: array of objects to distribute
     * @param byCols array of columns in the objects: object must provide values for these attributes
     * @returns {Array}
     */
    DistributeService.prototype.distributeBy = function (rows, byCols) {
        var _this = this;
        if (rows == null) {
            return null;
        }
        var distribution = [];
        byCols.forEach(function (col) {
            var r = _this.reduceToCount(rows, col);
            r = _.sortBy(r, function (item) { return item.value; });
            r = _.reverse(r);
            distribution.push({ axis: col, values: r });
        });
        return distribution;
    };
    DistributeService.prototype.reduceToCount = function (rows, col) {
        var occurences = rows.reduce(function (r, row) {
            r[row[col]] = ++r[row[col]] || 1;
            return r;
        }, {});
        var result = Object.keys(occurences).map(function (key) {
            return { key: key, value: occurences[key] };
        });
        return result;
    };
    return DistributeService;
}());
DistributeService = __decorate([
    Injectable()
], DistributeService);
export { DistributeService };
//# sourceMappingURL=distribute.service.js.map
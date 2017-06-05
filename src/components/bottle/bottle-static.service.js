var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by loicsalou on 28.02.17.
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Configuration } from '../config/Configuration';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';
/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
var BottleService = (function () {
    function BottleService(i18n, http) {
        var _this = this;
        this.i18n = i18n;
        this.http = http;
        this.bottles = require('../../assets/json/ma-cave.json');
        this.currentYear = new Date().getFullYear();
        this.bottles.map(function (btl) { return btl['classe_age'] = _this.setClasseAge(btl['millesime']); });
    }
    BottleService.prototype.setClasseAge = function (millesime) {
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
    };
    /**
     * searches through the given bottles all that match all of the filters passed in
     * @param fromList array of bottles
     * @param keywords an array of searched keywords
     * @returns array of matching bottles
     */
    BottleService.prototype.getBottlesByKeywords = function (fromList, keywords) {
        var _this = this;
        if (!keywords || keywords.length == 0) {
            return this.bottles;
        }
        var filtered = this.bottles;
        keywords.forEach(function (keyword) {
            filtered = _this.filterOnKeyword(filtered, keyword);
        });
        return filtered;
    };
    /**
     * get the bottles which match one keyword
     * @param list
     * @param keyword
     * @returns {any[]}
     */
    BottleService.prototype.filterOnKeyword = function (list, keyword) {
        return list.filter(function (bottle) {
            var matching = false;
            for (var key in bottle) {
                if (bottle[key].toString().toLocaleLowerCase().indexOf(keyword) !== -1) {
                    matching = true;
                }
            }
            return matching;
        });
    };
    /**
     * Returns bottles that match ALL filters.
     * <li>all filters must be satisfied: filtered list is refined for each new filter</li>
     * <li>for each value in filter, applies a "OR" between accepted values</li>
     * @param filters
     * @returns {any}
     */
    BottleService.prototype.getBottlesByFilter = function (filters) {
        if (filters.isEmpty()) {
            return this.bottles;
        }
        var filtered = this.bottles;
        // always start filtering using textual search
        if (filters.hasText()) {
            filtered = this.getBottlesByKeywords(this.bottles, filters.text);
        }
        // on hierarchical axis like regions and ages, use most precise filter if available
        if (filters.hasMillesimes()) {
            filtered = this.filterByAttribute(filtered, 'millesime', filters.millesime);
        }
        else {
            // if filtering on millesime no need to filter on ages (matching millesime implies matching ages slice)
            if (filters.hasAges()) {
                filtered = this.filterByAttribute(filtered, 'classe_age', filters.classe_age);
            }
        }
        // on hierarchical axis like regions and ages, use most precise filter if available
        if (filters.hasAppellations()) {
            filtered = this.filterByAttribute(filtered, 'area_label', filters.area_label);
        }
        else {
            // if filtering on area_label no need to filter on region (matching area_label implies matching subregion_label)
            if (filters.hasRegions()) {
                filtered = this.filterByAttribute(filtered, 'subregion_label', filters.subregion_label);
            }
        }
        if (filters.hasCouleurs()) {
            filtered = this.filterByAttribute(filtered, 'label', filters.label);
        }
        return filtered;
    };
    BottleService.prototype.filterByAttribute = function (fromList, attribute, admissibleValues) {
        return fromList.filter(function (bottle) {
            var ret = true;
            var attrValue = bottle[attribute].toString();
            admissibleValues.forEach(function (admissibleValue) { return ret = ret && attrValue.indexOf(admissibleValue) !== -1; });
            return ret;
        });
    };
    BottleService.prototype.getAllBottlesObservable = function () {
        return this.http.get('/assets/json/ma-cave.json')
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    BottleService.prototype.getBottlesObservable = function (searchParams) {
        if (!searchParams) {
            return this.getAllBottlesObservable();
        }
        var filtered = [];
        this.getAllBottlesObservable().subscribe(function (filtered) { return filtered.filter(function (bottle) {
            if (searchParams.subregion_label && searchParams.subregion_label.length > 0) {
                var regionCode = Configuration.regionsText2Code[bottle['subregion_label']];
                return searchParams.subregion_label.indexOf(regionCode) != -1;
            }
            else {
                return true;
            }
        }).filter(function (bottle) {
            if (searchParams.colors && searchParams.colors.length > 0) {
                var colorCode = Configuration.colorsText2Code[bottle['label']];
                return searchParams.colors.indexOf(colorCode) != -1;
            }
            else {
                return true;
            }
        }); });
        return Observable.create(function (observer) {
            observer.next(filtered);
        });
    };
    BottleService.prototype.handleError = function (error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    };
    BottleService.isEmpty = function (array, index) {
        return _.isEmpty(array, index);
    };
    BottleService.prototype.getBottlesBy = function (bottles, by, value) {
        var filtered = bottles.filter(function (bottle) {
            var field = bottle[by];
            if (typeof field === 'number') {
                return field === +value;
            }
            else {
                return field === value;
            }
        });
        return filtered;
    };
    return BottleService;
}());
BottleService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [TranslateService, Http])
], BottleService);
export { BottleService };
//# sourceMappingURL=bottle-static.service.js.map
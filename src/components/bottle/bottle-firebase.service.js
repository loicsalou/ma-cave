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
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FilterSet } from '../distribution/distribution';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { BottleFactory } from '../../model/bottle.factory';
import { Subject } from 'rxjs/Subject';
import { LoadingController } from 'ionic-angular';
/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
var BottleService = (function () {
    function BottleService(bottleFactory, firebase, loadingCtrl, firebaseAuth) {
        this.bottleFactory = bottleFactory;
        this.firebase = firebase;
        this.loadingCtrl = loadingCtrl;
        this.firebaseAuth = firebaseAuth;
        this.cellarImported = false;
        this._bottles = new BehaviorSubject([]);
        this._bottlesObservable = this._bottles.asObservable();
        this._filtersObservable = new Subject();
        this.firebaseAuth.auth.signInAnonymously().catch(function (a) {
            return console.error('login failed: ' + a);
        });
        this.firebaseRef = this.firebase.database.ref('users/loicsalou/bottles');
        this.setFilters(new FilterSet());
        this.fetchAllBottles();
    }
    BottleService.prototype.fetchAllBottles = function () {
        var _this = this;
        if (this.cellarImported) {
            this._bottles.next(this.bottlesArray);
        }
        else {
            this.showLoading();
            this.firebase.list('users/loicsalou/bottles').subscribe(function (bottles) {
                bottles.forEach(function (bottle) { return _this.bottleFactory.create(bottle); });
                _this.bottlesArray = bottles;
                _this._bottles.next(bottles);
                _this.filters.reset();
                _this.dismissLoading();
            });
        }
    };
    BottleService.prototype.save = function (bottles) {
        var _this = this;
        this.firebaseRef.remove();
        bottles.forEach(function (bottle) { return _this.firebaseRef.push(bottle); });
    };
    Object.defineProperty(BottleService.prototype, "bottlesObservable", {
        get: function () {
            return this._bottlesObservable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BottleService.prototype, "filtersObservable", {
        get: function () {
            return this._filtersObservable.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns bottles that match ALL filters.
     * <li>all filters must be satisfied: filtered list is refined for each new filter</li>
     * <li>for each value in filter, applies a "OR" between accepted values</li>
     * @param filters
     * @returns {any}
     */
    BottleService.prototype.filterOn = function (filters) {
        //console.info(Date.now()+" - filtering on "+filters.toString());
        if (this.bottlesArray == undefined) {
            return;
        }
        if (filters.isEmpty()) {
            this._bottles.next(this.bottlesArray);
        }
        var filtered = this.bottlesArray;
        // always start filtering using textual search
        if (filters.hasText()) {
            filtered = this.getBottlesByKeywords(this.bottlesArray, filters.text);
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
        this.setFilters(filters);
        this._bottles.next(filtered);
    };
    BottleService.prototype.showLoading = function () {
        if (this.loading == undefined) {
            this.loading = this.loadingCtrl.create({
                content: 'Chargement en cours...',
                dismissOnPageChange: false
            });
            this.loading.present();
        }
    };
    BottleService.prototype.dismissLoading = function () {
        if (this.loading != undefined) {
            this.loading.dismiss();
            this.loading = undefined;
        }
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
            return this._bottles;
        }
        var filtered = this.bottlesArray;
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
        var keywordLower = keyword.toLocaleLowerCase();
        return list.filter(function (bottle) {
            var matching = false;
            for (var key in bottle) {
                if (bottle[key].toString().toLocaleLowerCase().indexOf(keywordLower) !== -1) {
                    matching = true;
                }
            }
            return matching;
        });
    };
    BottleService.prototype.filterByAttribute = function (fromList, attribute, admissibleValues) {
        return fromList.filter(function (bottle) {
            var ret = true;
            var attrValue = bottle[attribute].toString();
            admissibleValues.forEach(function (admissibleValue) { return ret = ret && attrValue.indexOf(admissibleValue) !== -1; });
            return ret;
        });
    };
    //private getAuth(): AuthConfiguration {
    //  let me: AuthConfiguration = {
    //    method: AuthMethods.Anonymous, provider: AuthProviders.Anonymous
    //  };
    //
    //  return me;
    //}
    BottleService.prototype.handleError = function (error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    };
    BottleService.prototype.setFilters = function (filters) {
        this.filters = filters;
        this._filtersObservable.next(filters);
    };
    BottleService.prototype.setCellarContent = function (bottles) {
        this.cellarImported = true;
        this.bottlesArray = bottles;
        this._bottles.next(this.bottlesArray);
    };
    return BottleService;
}());
BottleService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [BottleFactory, AngularFireDatabase,
        LoadingController, AngularFireAuth])
], BottleService);
export { BottleService };
//# sourceMappingURL=bottle-firebase.service.js.map
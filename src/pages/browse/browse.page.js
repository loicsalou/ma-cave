var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { BottleService } from '../../components/bottle/bottle-firebase.service';
import { BottleDetailPage } from '../bottle-detail/page-bottle-detail';
import { FilterSet } from '../../components/distribution/distribution';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
var BrowsePage = (function () {
    function BrowsePage(toastCtrl, navCtrl, platform, bottlesService, params) {
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.bottlesService = bottlesService;
        this.searchBarVisible = false;
        this._bottles = new BehaviorSubject([]);
        this.bottlesObservable = this._bottles.asObservable();
        this.filterSet = new FilterSet();
        this.navParams = params;
    }
    BrowsePage.prototype.ngOnInit = function () {
        var _this = this;
        console.info('initializing browse page instance');
        this.bottleSubscription = this.bottlesService.bottlesObservable.subscribe(function (bottles) {
            //if (bottles && bottles.length > 0) {
            _this.setBottles(bottles);
            _this.checkNavigationParams();
            //}
        }, function (error) { return _this.showMessage('error ! ' + error); }, function () { return _this.showMessage('completed!'); });
        this.filterSubscription = this.bottlesService.filtersObservable.subscribe(function (filterSet) { return _this.setFilterSet(filterSet); });
    };
    BrowsePage.prototype.ngOnDestroy = function () {
        console.info('destroying browse page instance');
        this.filterSubscription.unsubscribe();
        this.bottleSubscription.unsubscribe();
    };
    BrowsePage.prototype.showMessage = function (s) {
        var basketToast = this.toastCtrl.create({
            message: s,
            cssClass: 'information-message',
            showCloseButton: true
        });
        basketToast.present();
    };
    // in case user navigated to here from the home page then we have search param ==> filter on this text
    BrowsePage.prototype.checkNavigationParams = function () {
        var _this = this;
        if (this.navParams != undefined && this.navParams.data['text'] != null) {
            this.filterSet.text = this.navParams.data['text'].split(' ');
            this.navParams.data['text'] = undefined;
            setTimeout(function () { return _this.bottlesService.filterOn(_this.filterSet); }, 10);
        }
    };
    BrowsePage.prototype.isSearchVisible = function () {
        return this.filterSet.isEmpty() || this.searchBarVisible;
    };
    BrowsePage.prototype.showSearchBar = function () {
        this.searchBarVisible = true;
    };
    BrowsePage.prototype.numberOfBottles = function () {
        return this.bottles == undefined ? 0 : this.bottles.length;
    };
    BrowsePage.prototype.isFiltering = function () {
        return !this.filterSet.isEmpty();
    };
    BrowsePage.prototype.setBottles = function (bottles) {
        this.bottles = bottles;
        this._bottles.next(this.bottles);
    };
    BrowsePage.prototype.filterOnText = function (event) {
        var filter = event.target.value;
        this.filterSet.reset();
        if (filter) {
            this.filterSet.text = filter.split(' ');
        }
        //this.showLoading();
        this.bottlesService.filterOn(this.filterSet);
    };
    BrowsePage.prototype.triggerDetail = function (bottleEvent) {
        bottleEvent.bottles = this.bottlesObservable;
        this.navCtrl.push(BottleDetailPage, { bottleEvent: bottleEvent });
    };
    BrowsePage.prototype.setFilterSet = function (filterSet) {
        this.filterSet = filterSet;
        this.searchBarVisible = false;
    };
    return BrowsePage;
}());
BrowsePage = __decorate([
    Component({
        selector: 'page-browse',
        templateUrl: 'browse.page.html',
        styleUrls: ['/src/pages/browse/browse.page.scss']
    }),
    __metadata("design:paramtypes", [ToastController, NavController, Platform,
        BottleService, NavParams])
], BrowsePage);
export { BrowsePage };
//# sourceMappingURL=browse.page.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BottleService } from '../bottle/bottle-firebase.service';
import { ToastController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
var BottleListComponent = (function () {
    function BottleListComponent(bottlesService, toastCtrl) {
        var _this = this;
        this.bottlesService = bottlesService;
        this.toastCtrl = toastCtrl;
        this.isFilterPanelShown = false;
        this.showDetail = new EventEmitter();
        this.dragItem = new Subject();
        this.dragItem.asObservable().debounceTime(50)
            .distinctUntilChanged()
            .subscribe(function (slidingBottle) { return _this.addToFavoritesOrRemove(slidingBottle); });
    }
    BottleListComponent.prototype.filter = function () {
        this.isFilterPanelShown = true;
    };
    BottleListComponent.prototype.triggerDetail = function (bottle, index) {
        this.showDetail.emit({ bottle: bottle, index: index });
    };
    BottleListComponent.prototype.ionDrag = function (bottle, item) {
        var percent = item.getSlidingPercent();
        if (percent < 0 && Math.abs(percent) > 0.15) {
            console.info(bottle.nomCru + ' dragged');
            this.dragItem.next({ slidingItem: item, bottle: bottle });
        }
    };
    BottleListComponent.prototype.switchSelected = function (event, bottle) {
        event.stopPropagation();
        bottle['selected'] = bottle['selected'] ? !bottle['selected'] : true;
        //if (this.isSelected(bottle)) {
        //  this.selected = this.selected.filter(btl => btl.id != bottle.id);
        //} else {
        //  this.selected.push(bottle);
        //}
    };
    BottleListComponent.prototype.isSelected = function (bottle) {
        return bottle['selected'];
        //return this.selected.filter(item => item.id === bottle.id).length == 1;
    };
    BottleListComponent.prototype.isBottleFavorite = function (bottle) {
        return bottle['favorite'];
        //return this.favorites.filter(item => item.id === bottle.id).length == 1;
    };
    BottleListComponent.prototype.addToFavoritesOrRemove = function (slidingBottle) {
        this.manageFavorites(slidingBottle.slidingItem, slidingBottle.bottle);
    };
    BottleListComponent.prototype.manageFavorites = function (slidingItem, bottle) {
        bottle['favorite'] = bottle['favorite'] ? !bottle['favorite'] : true;
        //if (this.isBottleFavorite(bottle)) {
        //  this.favorites = this.favorites.filter(btl => btl.id != bottle.id);
        //  console.info(bottle.nomCru + ' no longer favorite');
        //} else {
        //  this.favorites.push(bottle);
        //  console.info(bottle.nomCru + ' is now favorite');
        //}
        slidingItem.close();
    };
    BottleListComponent.prototype.isBottleInBasket = function (bottle) {
        return bottle['in-basket'];
        //return this.basket.filter(item => item.id === bottle.id).length == 1;
    };
    BottleListComponent.prototype.addToBasketOrRemove = function (event, slidingItem, bottle) {
        event.stopPropagation();
        slidingItem.close();
        bottle['in-basket'] = bottle['in-basket'] ? !bottle['in-basket'] : true;
        if (this.isBottleInBasket(bottle)) {
            //this.basket = this.basket.filter(btl => btl.id != bottle.id);
            var basketToast = this.toastCtrl.create({
                message: 'la bouteille ' + bottle.nomCru + ' a été placée dans le' +
                    ' panier',
                cssClass: 'information-message',
                duration: 2000,
                position: 'middle'
            });
            basketToast.present();
        }
        else {
            //this.basket.push(bottle);
            var basketToast = this.toastCtrl.create({
                message: 'la bouteille ' + bottle.nomCru + ' a été retirée du panier',
                cssClass: 'information-message',
                duration: 2000,
                position: 'middle'
            });
            basketToast.present();
        }
    };
    BottleListComponent.prototype.drawBottle = function (event, slidingItem, bottle) {
        event.stopPropagation();
        slidingItem.close();
        var basketToast = this.toastCtrl.create({
            message: 'la bouteille ' + bottle.nomCru + ' a été retirée du stock',
            duration: 2000,
            cssClass: 'information-message',
            position: 'top'
        });
        basketToast.present();
    };
    return BottleListComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Array)
], BottleListComponent.prototype, "bottles", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], BottleListComponent.prototype, "showDetail", void 0);
BottleListComponent = __decorate([
    Component({
        selector: 'bottle-list',
        templateUrl: 'bottle-list.component.html',
        styleUrls: ['/bottle-list.component.scss']
    }),
    __metadata("design:paramtypes", [BottleService, ToastController])
], BottleListComponent);
export { BottleListComponent };
//# sourceMappingURL=bottle-list.component.js.map
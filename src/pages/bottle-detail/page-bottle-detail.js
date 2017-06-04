var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { Bottle } from '../../components/bottle/bottle';
import { UpdatePage } from '../update/update.page';
/*
 Generated class for the BottleDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
var BottleDetailPage = (function () {
    function BottleDetailPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        var bottleEvent = navParams.data['bottleEvent'];
        this.bottlesObservable = bottleEvent.bottles;
        this.bottle = bottleEvent.bottle;
        this.currentIndex = bottleEvent.index;
    }
    BottleDetailPage.prototype.ngOnInit = function () {
        var _this = this;
        this.bottlesObservable.subscribe(function (bottles) {
            _this.bottles = bottles;
            _this.bottle = _this.bottles[_this.currentIndex];
        });
    };
    BottleDetailPage.prototype.update = function () {
        this.navCtrl.push(UpdatePage, { bottle: this.bottle });
    };
    BottleDetailPage.prototype.ionViewDidEnter = function () {
        this.slides.slideTo(this.currentIndex);
    };
    BottleDetailPage.prototype.slideChanged = function () {
        this.currentIndex = this.slides.getActiveIndex();
        this.bottle = this.bottles[this.currentIndex];
    };
    return BottleDetailPage;
}());
__decorate([
    Input(),
    __metadata("design:type", Array)
], BottleDetailPage.prototype, "bottles", void 0);
__decorate([
    Input(),
    __metadata("design:type", Bottle)
], BottleDetailPage.prototype, "bottle", void 0);
__decorate([
    ViewChild(Slides),
    __metadata("design:type", Slides)
], BottleDetailPage.prototype, "slides", void 0);
BottleDetailPage = __decorate([
    Component({
        selector: 'page-bottle-detail',
        templateUrl: 'page-bottle-detail.html',
        styleUrls: ['/page-bottle-detail.scss']
    }),
    __metadata("design:paramtypes", [NavController, NavParams])
], BottleDetailPage);
export { BottleDetailPage };
//# sourceMappingURL=page-bottle-detail.js.map
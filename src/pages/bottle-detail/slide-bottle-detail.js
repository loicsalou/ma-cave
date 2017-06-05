var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Bottle } from '../../components/bottle/bottle';
import { UpdatePage } from '../update/update.page';
var BottleDetailSlide = (function () {
    function BottleDetailSlide(navCtrl) {
        this.navCtrl = navCtrl;
    }
    BottleDetailSlide.prototype.getIndex = function () {
        return this.index + 1;
    };
    BottleDetailSlide.prototype.update = function () {
        this.navCtrl.push(UpdatePage, { bottle: this.bottle });
    };
    return BottleDetailSlide;
}());
__decorate([
    Input(),
    __metadata("design:type", Bottle)
], BottleDetailSlide.prototype, "bottle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], BottleDetailSlide.prototype, "showName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], BottleDetailSlide.prototype, "index", void 0);
BottleDetailSlide = __decorate([
    Component({
        selector: 'slide-bottle-detail',
        templateUrl: 'slide-bottle-detail.html',
        styleUrls: ['/slide-bottle-detail.scss']
    }),
    __metadata("design:paramtypes", [NavController])
], BottleDetailSlide);
export { BottleDetailSlide };
//# sourceMappingURL=slide-bottle-detail.js.map
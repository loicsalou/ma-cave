var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewEncapsulation } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BottleService } from '../../components/bottle/bottle-firebase.service';
/*
 Generated class for the Update component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
var UpdatePage = (function () {
    function UpdatePage(navCtrl, navParams, bottleService) {
        this.bottleService = bottleService;
        this.bottle = navParams.data['bottle'];
    }
    UpdatePage.prototype.save = function () {
        this.bottleService.save([this.bottle]);
    };
    return UpdatePage;
}());
UpdatePage = __decorate([
    Component({
        selector: 'update',
        templateUrl: '/update.page.html',
        styleUrls: ['/update.page.scss'],
        // warning: few browsers support shadow DOM encapsulation at this time
        encapsulation: ViewEncapsulation.Emulated
    }),
    __metadata("design:paramtypes", [NavController, NavParams, BottleService])
], UpdatePage);
export { UpdatePage };
//# sourceMappingURL=update.page.js.map
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
import { ActionSheetController, NavController, Platform } from 'ionic-angular';
import { BrowsePage } from '../browse/browse.page';
var HomePage = (function () {
    function HomePage(navCtrl, platform, actionsheetCtrl) {
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.actionsheetCtrl = actionsheetCtrl;
    }
    HomePage.prototype.ngOnInit = function () {
        this.version = require('../../../package.json').version;
    };
    HomePage.prototype.filterOnText = function (event) {
        var text = event.target.value;
        if (text != undefined && text.length != 0) {
            this.navCtrl.push(BrowsePage, {
                text: text
            });
        }
        ;
    };
    HomePage.prototype.manageCellar = function () {
        // this.navCtrl.push(BrowsePage);
    };
    HomePage.prototype.browseCellar = function () {
        this.navCtrl.push(BrowsePage);
    };
    HomePage.prototype.openMenu = function () {
        var actionSheet = this.actionsheetCtrl.create({
            title: 'Filter',
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: function () {
                        console.log('Delete clicked');
                    }
                },
                {
                    text: 'Share',
                    icon: !this.platform.is('ios') ? 'share' : null,
                    handler: function () {
                        console.log('Share clicked');
                    }
                },
                {
                    text: 'Play',
                    icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
                    handler: function () {
                        console.log('Play clicked');
                    }
                },
                {
                    text: 'Favorite',
                    icon: !this.platform.is('ios') ? 'heart-outline' : null,
                    handler: function () {
                        console.log('Favorite clicked');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    return HomePage;
}());
HomePage = __decorate([
    Component({
        selector: 'page-home',
        templateUrl: 'home.html',
        styleUrls: ['/home.scss']
    }),
    __metadata("design:paramtypes", [NavController, Platform,
        ActionSheetController])
], HomePage);
export { HomePage };
//# sourceMappingURL=home.js.map
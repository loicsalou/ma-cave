var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
///<reference path="../../../node_modules/ionic-angular/navigation/nav-controller.d.ts"/>
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Camera } from '@ionic-native/camera';
var AboutPage = (function () {
    function AboutPage(navCtrl, camera, platform, i18n) {
        this.navCtrl = navCtrl;
        this.camera = camera;
        this.platform = platform;
        this.i18n = i18n;
        this.images = [];
    }
    AboutPage.prototype.ngOnInit = function () {
        var json = require('../../../package.json');
        this.name = json.name;
        this.version = json.version;
    };
    AboutPage.prototype.choosePicture = function (event) {
        event.stopPropagation();
        /*
         console.info('zone ' + event.currentTarget.title + ' cliquée');
         let options = { destinationType: Camera.DestinationType.NATIVE_URI, encodingType: Camera.EncodingType.JPEG, mediaType: Camera.MediaType.PICTURE, sourceType: 1, saveToPhotoAlbum: false, correctOrientation: true };
         Camera.getPicture(options).then((imageData) => {
         let base64Image = 'data:image/jpeg;base64,' + imageData;
         this.message='image capturée !';
         }, (err) => {
         console.error('Erreur lors de la prise de la photo !');
         this.message='Erreur lors de la prise de la photo ! '+err;
         });
         */
        //ImagePicker.getPictures({maximumImagesCount: 3}).then((results) => {
        //                                                        for (var i = 0; i < results.length; i++) {
        //                                                          this.imagePath = results[ i ];
        //                                                          this.message = this.imagePath;
        //                                                        }
        //                                                      }
        //  ,
        //                                                      (err) => {
        //                                                        this.message = "Erreur d'accès à la photo ! " + err;
        //                                                      }
        //)
        //;
    };
    AboutPage.prototype.showTrads = function () {
        this.trad = this.i18n.instant('area_label');
    };
    AboutPage.prototype.removePicture = function (event) {
        event.stopPropagation();
        this.imagePath = null;
    };
    //
    //onclick(event: any) {
    //  console.info('zone ' + event.currentTarget.title + ' cliquée');
    //  this.platform.ready().then(() => {
    //    let options = {
    //      quality: 80,
    //      destinationType: Camera.DestinationType.DATA_URL,
    //      sourceType: Camera.PictureSourceType.CAMERA,
    //      allowEdit: false,
    //      encodingType: Camera.EncodingType.JPEG,
    //      saveToPhotoAlbum: false
    //    };
    //    // https://github.com/apache/cordova-plugin-camera#module_camera.getPicture
    //    Camera.getPicture(options).then((imageData) => {
    //      let base64Image = 'data:image/jpeg;base64,' + imageData;
    //      this.message = 'image capturée ! ' + imageData;
    //    }, (err) => {
    //      console.error('Erreur lors de la prise de la photo !');
    //      this.message = 'Erreur lors de la prise de la photo ! ' + err;
    //    });
    //  });
    //}
    AboutPage.prototype.takePhoto = function () {
        var _this = this;
        var options = {
            quality: 80,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: false
        };
        this.camera.getPicture(options).then(function (imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            var base64Image = 'data:image/jpeg;base64,' + imageData;
            _this.images.unshift({
                src: base64Image
            });
        }, function (err) {
            alert('ERROR ! ' + err);
        });
    };
    return AboutPage;
}());
AboutPage = __decorate([
    Component({
        selector: 'page-about',
        templateUrl: 'about.html',
        styleUrls: [
            '/about.scss'
        ]
    }),
    __metadata("design:paramtypes", [NavController, Camera, Platform,
        TranslateService])
], AboutPage);
export { AboutPage };
//# sourceMappingURL=about.js.map
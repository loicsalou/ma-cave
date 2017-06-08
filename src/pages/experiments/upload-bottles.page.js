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
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import * as _ from 'lodash';
import { BottleFactory } from '../../model/bottle.factory';
import { BottleService } from '../../components/bottle/bottle-firebase.service';
import { CavusService } from './cavus.service';
/**
 * Generated class for the UploadBottles page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var UploadBottlesPage = (function () {
    function UploadBottlesPage(navCtrl, navParams, file, filepath, transfer, fileChooser, alertController, toastController, barcodeScanner, camera, bottleService, bottleFactory, cavusService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.file = file;
        this.filepath = filepath;
        this.transfer = transfer;
        this.fileChooser = fileChooser;
        this.alertController = alertController;
        this.toastController = toastController;
        this.barcodeScanner = barcodeScanner;
        this.camera = camera;
        this.bottleService = bottleService;
        this.bottleFactory = bottleFactory;
        this.cavusService = cavusService;
        this.oneBottle = '';
        this.fileContent = '<vide>';
        this.images = [];
        this.from = 0;
        this.nbRead = 2;
        this.viewNb = 0;
        this.bottles = null;
    }
    UploadBottlesPage.prototype.takePhoto = function () {
        var _this = this;
        var options = {
            quality: 80,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: this.camera.EncodingType.PNG,
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
            _this.presentAlert('Error !', err);
        });
    };
    UploadBottlesPage.prototype.scan = function () {
        var _this = this;
        var opt = {
            preferFrontCamera: false,
            showFlipCameraButton: false,
            showTorchButton: false,
            prompt: 'Scanner un code'
        };
        this.barcodeScanner.scan(opt)
            .then(function (value) {
            _this.qrCode = value;
            _this.qrCodeText = value.text;
        })
            .catch(function (err) {
            _this.presentAlert('Echec !', 'le scan a échoué: ' + err);
            _this.qrCodeText = err;
        });
    };
    UploadBottlesPage.prototype.chooseFile = function () {
        var _this = this;
        this.fileChooser.open()
            .then(function (uri) {
            //this.presentAlert('Succès !', 'l uri choisie est ' + uri);
            _this.filepath.resolveNativePath(uri).then(function (result) {
                var nativepath = result;
                _this.readFile(nativepath);
            });
        })
            .catch(function (e) {
            _this.presentAlert('Echec... !', 'erreur chooseFile ' + e);
        });
    };
    UploadBottlesPage.prototype.saveBottles = function () {
        try {
            this.bottleService.save(this.bottles);
            this.bottles = null;
        }
        catch (ex) {
            this.presentAlert('Error !', 'La sauvegarde des données a échoué: ' + ex);
        }
    };
    UploadBottlesPage.prototype.cavus = function () {
        this.cavusService.connectToCavus();
    };
    UploadBottlesPage.prototype.readFile = function (nativepath) {
        var _this = this;
        var xlsx = require('xlsx');
        window.resolveLocalFileSystemURL(nativepath, function (res) {
            res.file(function (resFile) {
                try {
                    var workbook = xlsx.readFile(resFile);
                }
                catch (err) {
                    console.error('-1-' + err);
                    _this.showError('-1-' + err);
                }
                var reader = new FileReader();
                reader.readAsText(resFile);
                reader.onloadend = function (evt) {
                    try {
                        _this.fileContent = evt.target.result;
                        _this.parseContent();
                    }
                    catch (err) {
                        console.error('-2-' + err);
                        _this.showError('-2-' + err);
                    }
                };
            });
        }, function (err) { return _this.presentAlert('Echec... !', 'erreur readFile ' + err); });
    };
    UploadBottlesPage.prototype.presentAlert = function (title, text) {
        var alert = this.alertController.create({
            title: title,
            subTitle: text,
            buttons: ['Ok']
        });
        alert.present();
    };
    UploadBottlesPage.prototype.parseEmbeddedFile = function () {
        this.fileContent = 'nomCru;country_label;subregion_label;area_label;label;millesime;volume;date_achat;prix;cote;quantite_courante;quantite_achat;garde_min;garde_max;garde_optimum;suggestion;comment;lieu_achat;canal_vente\n' +
            'A. Chauvet - Cachet Rouge - Millésimé;France;Champagne;Champagne Grand Cru;blanc effervescent;2008;75 cl;11.03.16;28;28;2;3;2;10;2;;;salon de la gastro Annecy le vieux;En direct du producteur\n' +
            'A. Chauvet - Cachet Vert;France;Champagne;Champagne;blanc effervescent;-;75 cl;11.03.16;17.8;17.8;2;3;2;10;2;;à boire avant 2018;salon de la gastro Annecy le vieux;En direct du producteur';
        this.parseContent();
    };
    UploadBottlesPage.prototype.parseContent = function () {
        var _this = this;
        var csvarray = this.fileContent.split('\n');
        var keys = _.first(csvarray).split(';');
        var values = _.drop(csvarray, 1 + this.from);
        values = _.take(values, this.nbRead);
        this.bottles = [];
        var self = this;
        try {
            this.bottles = _.map(values, function (row) {
                try {
                    var btl = buildObject(row, keys);
                    return self.bottleFactory.create(btl);
                }
                catch (ex) {
                    self.showError('Parsing error enreg ' + row + ex);
                }
            }, {});
        }
        catch (ex2) {
            self.showError('Parsing global error enreg ' + ex2);
        }
        this.bottleService.allBottlesObservable.subscribe(function (list) {
            if (list && list.length > 0) {
                _this.oneBottle = JSON.stringify(_this.bottles[_this.viewNb]);
            }
        });
        this.bottleService.setCellarContent(this.bottles);
        return this.bottles;
    };
    UploadBottlesPage.prototype.parseContentXLS = function (event) {
        var file = event.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            var buf = new Uint8Array(evt.target['result']);
            console.info('ooo');
            var decoder = new TextDecoder('utf-8');
            var s = decoder.decode(buf);
            //buf = buf.map((byte) => byte-65);
        };
        reader.readAsArrayBuffer(file);
    };
    UploadBottlesPage.prototype.parseContentXLS2 = function (event) {
        var textType = /text.*/;
        var file = event.currentTarget.files[0];
        //if (! file.type.match(textType)) {
        //  alert('File not supported!');
        //  return;
        //}
        console.info(event.currentTarget.files[0]);
        var reader = new FileReader();
        var nbread = this.nbRead;
        var nbfrom = this.from;
        var self = this;
        var bottleService = this.bottleService;
        reader.onload = function (evt) {
            var csvarray = evt.target['result'].split(/\r\n|\n/);
            var keys = _.first(csvarray).replace(/['"]+/g, '').split(/\t/);
            var values = _.drop(csvarray, 1 + nbfrom);
            values = _.take(values, nbread);
            var bottles = null;
            try {
                bottles = _.map(values, function (row) {
                    try {
                        var btl = buildObjectFromXLS(row, keys);
                        return self.bottleFactory.create(btl);
                    }
                    catch (ex) {
                        self.showError('Parsing error enreg ' + row + ex);
                    }
                }, {});
            }
            catch (ex2) {
                self.showError('Parsing global error enreg ' + ex2);
            }
            bottleService.allBottlesObservable.subscribe(function (list) {
                self.bottles = list;
                if (list && list.length > 0) {
                    console.info(JSON.stringify(list[0]));
                }
            });
            bottleService.setCellarContent(bottles);
        };
        reader.onerror = function (evt) {
            alert('cannot read the file ! ' + file);
        };
        reader.readAsText(file, 'gzip');
    };
    UploadBottlesPage.prototype.showError = function (s) {
        var basketToast = this.toastController.create({
            message: s,
            cssClass: 'error-message',
            showCloseButton: true
        });
        basketToast.present();
    };
    return UploadBottlesPage;
}());
UploadBottlesPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-upload-bottles',
        templateUrl: 'upload-bottles.page.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        File,
        FilePath,
        Transfer,
        FileChooser,
        AlertController,
        ToastController,
        BarcodeScanner,
        Camera,
        BottleService,
        BottleFactory,
        CavusService])
], UploadBottlesPage);
export { UploadBottlesPage };
function buildObject(row, keys) {
    var object = {};
    var values = row.split(';');
    _.each(keys, function (key, i) {
        if (i < values.length) {
            object[key] = values[i];
        }
        else {
            object[key] = '';
        }
    });
    return object;
}
function buildObjectFromXLS(row, keys) {
    var object = {};
    var rowString = row.replace(/['"]+/g, '');
    var values = rowString.split(/\t/);
    _.each(keys, function (key, i) {
        if (i < values.length) {
            object[key] = values[i];
        }
        else {
            object[key] = '';
        }
    });
    return object;
}
//# sourceMappingURL=upload-bottles.page.js.map

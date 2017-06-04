import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {FileChooser} from '@ionic-native/file-chooser';
import {File} from '@ionic-native/file';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult} from '@ionic-native/barcode-scanner';
import {Transfer} from '@ionic-native/transfer';
import {FilePath} from '@ionic-native/file-path';
import * as _ from 'lodash';
import {BottleFactory} from '../../model/bottle.factory';
import {BottleService} from '../../components/bottle/bottle-firebase.service';
import {Bottle} from '../../components/bottle/bottle';
import {CavusService} from './cavus.service';
import * as decoder from 'text-encoding';

/**
 * Generated class for the UploadBottles page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
             selector: 'page-upload-bottles',
             templateUrl: 'upload-bottles.page.html'
           })
export class UploadBottlesPage {
  oneBottle: string = '';
  qrCode: BarcodeScanResult;
  qrCodeText: string;
  fileContent: string = '<vide>';
  images: Array<{ src: String }> = [];
  from: number = 0;
  nbRead: number = 2;
  viewNb: number = 0;
  private bottles: Bottle[] = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private file: File,
              private filepath: FilePath,
              private transfer: Transfer,
              private fileChooser: FileChooser,
              private alertController: AlertController,
              private toastController: ToastController,
              private barcodeScanner: BarcodeScanner,
              private camera: Camera,
              private bottleService: BottleService,
              private bottleFactory: BottleFactory,
              private cavusService: CavusService) {
  }

  public takePhoto() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.images.unshift({
                            src: base64Image
                          })
    }, (err) => {
      this.presentAlert('Error !', err);
    });
  }

  public scan() {
    let opt: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: false,
      showTorchButton: false,
      prompt: 'Scanner un code'
    };

    this.barcodeScanner.scan(opt)
      .then(value => {
        this.qrCode = value;
        this.qrCodeText = value.text;
      })
      .catch(err => {
        this.presentAlert('Echec !', 'le scan a échoué: ' + err);
        this.qrCodeText = err;
      });
  }

  public chooseFile() {
    this.fileChooser.open()
      .then(uri => {
        //this.presentAlert('Succès !', 'l uri choisie est ' + uri);
        this.filepath.resolveNativePath(uri).then((result) => {
          let nativepath = result;
          this.readFile(nativepath);
        });
      })
      .catch(e => {
        this.presentAlert('Echec... !', 'erreur chooseFile ' + e);
      });
  }

  public saveBottles() {
    try {
      this.bottleService.save(this.bottles);
      this.bottles = null;
    } catch (ex) {
      this.presentAlert('Error !', 'La sauvegarde des données a échoué: ' + ex);
    }
  }

  public cavus() {
    this.cavusService.connectToCavus();
  }

  private readFile(nativepath: any) {
    let xlsx = require('xlsx');
    (<any>window).resolveLocalFileSystemURL(nativepath, (res) => {
                                              res.file((resFile) => {
                                                try {
                                                  let workbook = xlsx.readFile(resFile)
                                                } catch (err) {
                                                  console.error('-1-' + err);
                                                  this.showError('-1-' + err);
                                                }
                                                let reader = new FileReader();
                                                reader.readAsText(resFile);
                                                reader.onloadend = (evt: any) => {
                                                  try {
                                                    this.fileContent = evt.target.result;
                                                    this.parseContent();
                                                  } catch (err) {
                                                    console.error('-2-' + err);
                                                    this.showError('-2-' + err);
                                                  }
                                                }
                                              })
                                            }, err => this.presentAlert('Echec... !', 'erreur readFile ' + err)
    );
  }

  private presentAlert(title: string, text: string) {
    let alert = this.alertController.create({
                                              title: title,
                                              subTitle: text,
                                              buttons: [ 'Ok' ]
                                            });
    alert.present();
  }

  parseEmbeddedFile() {
    this.fileContent = 'nomCru;country_label;subregion_label;area_label;label;millesime;volume;date_achat;prix;cote;quantite_courante;quantite_achat;garde_min;garde_max;garde_optimum;suggestion;comment;lieu_achat;canal_vente\n' +
      'A. Chauvet - Cachet Rouge - Millésimé;France;Champagne;Champagne Grand Cru;blanc effervescent;2008;75 cl;11.03.16;28;28;2;3;2;10;2;;;salon de la gastro Annecy le vieux;En direct du producteur\n' +
      'A. Chauvet - Cachet Vert;France;Champagne;Champagne;blanc effervescent;-;75 cl;11.03.16;17.8;17.8;2;3;2;10;2;;à boire avant 2018;salon de la gastro Annecy le vieux;En direct du producteur';
    this.parseContent();
  }

  private parseContent() {
    let csvarray = this.fileContent.split('\n');
    let keys = _.first(csvarray).split(';');
    let values = _.drop(csvarray, 1 + this.from);
    values = _.take(values, this.nbRead);
    this.bottles = [];
    let self = this;
    try {
      this.bottles = _.map(values, function (row) {
        try {
          let btl: Bottle = <Bottle>buildObject(row, keys);
          return self.bottleFactory.create(btl);
        } catch (ex) {
          self.showError('Parsing error enreg ' + row + ex);
        }
      }, {});
    } catch (ex2) {
      self.showError('Parsing global error enreg ' + ex2);
    }
    this.bottleService.bottlesObservable.subscribe((list: Bottle[]) => {
      if (list && list.length > 0) {
        this.oneBottle = JSON.stringify(this.bottles[ this.viewNb ]);
      }
    });
    this.bottleService.setCellarContent(this.bottles);

    return this.bottles;
  }

  public parseContentXLS2(event: any) {
    let file = event.currentTarget.files[ 0 ];
    let reader = new FileReader();
    reader.onload = function (evt) {
      let buf = new Uint8Array(evt.target['result']);
      let dec = new decoder.TextDecoder('ascii');
      let s=dec.decode(buf);
      console.info('ooo');
      //buf = buf.map((byte) => byte-65);
    }
    reader.readAsArrayBuffer(file);
  }

  public parseContentXLS(event: any) {
    let textType = /text.*/;
    let file = event.currentTarget.files[ 0 ];
    //if (! file.type.match(textType)) {
    //  alert('File not supported!');
    //  return;
    //}
    console.info(event.currentTarget.files[ 0 ]);
    let reader = new FileReader();
    let nbread = this.nbRead;
    let nbfrom = this.from;
    let self = this;
    let bottleService = this.bottleService;
    reader.onload = function (evt) {
      let csvarray = evt.target[ 'result' ].split(/\r\n|\n/);
      let keys = _.first(csvarray).replace(/['"]+/g, '').split(/\t/);
      let values = _.drop(csvarray, 1 + nbfrom);
      values = _.take(values, nbread);
      let bottles = null;
      try {
        bottles = _.map(values, function (row) {
          try {
            let btl: Bottle = <Bottle>buildObjectFromXLS(row, keys);
            return self.bottleFactory.create(btl);
          } catch (ex) {
            self.showError('Parsing error enreg ' + row + ex);
          }
        }, {});
      } catch (ex2) {
        self.showError('Parsing global error enreg ' + ex2);
      }
      bottleService.bottlesObservable.subscribe((list: Bottle[]) => {
        self.bottles = list;
        if (list && list.length > 0) {
          console.info(JSON.stringify(list[ 0 ]));
        }
      });
      bottleService.setCellarContent(bottles);
    }
    reader.onerror = function (evt) {
      alert('cannot read the file ! ' + file);
    };
    reader.readAsText(file, 'ascii');
  }

  private showError(s: string) {
    let basketToast = this.toastController.create({
                                                    message: s,
                                                    cssClass: 'error-message',
                                                    showCloseButton: true
                                                  });
    basketToast.present();
  }
}

function buildObject(row: any, keys: any) {
  let object = {};
  let values = row.split(';');
  _.each(keys, function (key, i) {
    if (i < values.length) {
      object[ key ] = values[ i ];
    } else {
      object[ key ] = '';
    }
  })
  return object;
}

function buildObjectFromXLS(row: any, keys: any) {
  let object = {};
  let rowString = row.replace(/['"]+/g, '');
  let values = rowString.split(/\t/);
  _.each(keys, function (key, i) {
    if (i < values.length) {
      object[ key ] = values[ i ];
    } else {
      object[ key ] = '';
    }
  })
  return object;
}

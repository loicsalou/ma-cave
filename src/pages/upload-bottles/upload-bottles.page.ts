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
  nbRead: number = 999;
  viewNb: number = 0;
  private bottles: Bottle[] = null;
  encoding: string; // forcer l'encoding

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
      this.bottleService.initializeDB(this.bottles);
      this.bottles = null;
    } catch (ex) {
      this.presentAlert('Error !', 'La sauvegarde des données a échoué: ' + ex);
    }
  }

  private readBrowserFile(event: any) {
    //let textType = /text.*/;
    let file = event.currentTarget.files[ 0 ];
    let isXls = file.name.toLowerCase().endsWith('.xls');
    let encoding = isXls ? 'ascii' : 'utf-8';
    console.info(event.currentTarget.files[ 0 ]);
    let reader = new FileReader();
    let self = this;
    reader.onload = function (evt) {
      self.fileContent = evt.target[ 'result' ];
      if (isXls) {
        self.parseContentXLS();
      } else {
        self.parseContentCSV();
      }
    }
    reader.onerror = function (evt) {
      alert('cannot read the file ! ' + file);
    };
    reader.readAsText(file, encoding);
  }

  private readFile(nativepath: any) {
    (<any>window).resolveLocalFileSystemURL(nativepath, (res) => {
                                              res.file((resFile) => {
                                                let reader = new FileReader();
                                                let isXls = resFile.name.toLowerCase().endsWith('.xls');
                                                if (this.encoding == null) {
                                                  this.encoding = isXls ? 'ascii' : 'utf-8';
                                                }
                                                reader.readAsText(resFile, this.encoding);
                                                reader.onloadend = (evt: any) => {
                                                  this.fileContent = evt.target.result;
                                                  if (isXls) {
                                                    this.parseContentXLS();
                                                  } else {
                                                    this.parseContentCSV();
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

  private parseContentCSV() {
    let csvarray = this.fileContent.split('\n');
    let keys = _.first(csvarray).split(';');
    let values = _.drop(csvarray, 1 + this.from);
    values = _.take(values, this.nbRead);
    let bottles = [];
    let self = this;
    try {
      bottles = _.map(values, function (row) {
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
    this.bottleService.setCellarContent(bottles);
    this.bottles=bottles;
    this.presentAlert('Parsing OK', 'CSV parsé au format ' + this.encoding + ' nombre lu ' + csvarray.length + ' chargé '
                      + (bottles == null ? 'KO' + ' !' : bottles.length));

    return this.bottles;
  }

  public parseContentXLS() {
    //let textType = /text.*/;
    let nbread = this.nbRead;
    let nbfrom = this.from;
    let csvarray = this.fileContent.split(/\r\n|\n/);
    let keys = _.first(csvarray).replace(/['"]+/g, '').split(/\t/);
    let values = _.drop(csvarray, 1 + nbfrom);
    values = _.take(values, nbread);
    let bottles = _.map(values, row => {
      try {
        let btl: Bottle = <Bottle>buildObjectFromXLS(row, keys);
        return this.bottleFactory.create(btl);
      } catch (ex) {
        this.showError('Parsing error enreg ' + row + ex);
      }
    }, err => this.showError('Parsing global error enreg ' + err));
    this.bottleService.setCellarContent(bottles);
    this.bottles=bottles;
    this.presentAlert('Parsing OK', 'XLS parsé au format ' + this.encoding + ' nombre lu ' + csvarray.length + ' chargé '
                      + (bottles == null ? 'KO' + ' !' : bottles.length));
  }

  //public parseContentXLS2(event: any) {
  //  let file = event.currentTarget.files[ 0 ];
  //  let reader = new FileReader();
  //  reader.onload = function (evt) {
  //    let buf = new Uint8Array(evt.target['result']);
  //    let dec = new decoder.TextDecoder('ascii');
  //    let s=dec.decode(buf);
  //    console.info('ooo');
  //    //buf = buf.map((byte) => byte-65);
  //  }
  //  reader.readAsArrayBuffer(file);
  //}

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

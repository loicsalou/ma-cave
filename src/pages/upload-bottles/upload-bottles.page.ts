import {Component} from "@angular/core";
import {AlertController, IonicPage, NavController, NavParams} from "ionic-angular";
import {FileChooser} from "@ionic-native/file-chooser";
import {File} from "@ionic-native/file";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult} from "@ionic-native/barcode-scanner";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import * as _ from "lodash";

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
  qrCode: BarcodeScanResult;
  qrCodeText: string;
  fileContent: string = '<vide>';
  images: Array<{ src: String }> = [];

  //private fileTransfer: TransferObject = this.transfer.create();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private file: File,
              private filepath: FilePath,
              private transfer: Transfer,
              private fileChooser: FileChooser,
              private alertController: AlertController,
              private barcodeScanner: BarcodeScanner,
              private camera: Camera) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadBottles');
  }

  takePhoto() {
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

  scan() {
    let opt: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: false,
      showTorchButton: false,
      prompt: 'Scanner un code'
    };

    this.barcodeScanner.scan(opt)
      .then(value => {
        //this.presentAlert('Succès !', 'le code est: ' + value);
        this.qrCode = value;
        this.qrCodeText = value.text;
      })
      .catch(err => {
        this.presentAlert('Echec !', 'le scan a échoué: ' + err);
        this.qrCodeText = err;
      });
  }

  chooseFile() {
    this.fileChooser.open()
      .then(uri => {
        //this.presentAlert('Succès !', 'l uri choisie est ' + uri);
        this.filepath.resolveNativePath(uri).then((result) => {
          let nativepath = result;
          this.readFile(nativepath);
        });
      })
      .catch(e => {
        //console.info(typeof e + ' : ' + e);
        this.presentAlert('Echec... !', 'erreur chooseFile ' + e);
      });
  }

  readFile(nativepath: any) {
    (<any>window).resolveLocalFileSystemURL(nativepath, (res) => {
                                              res.file((resFile) => {
                                                let reader = new FileReader();
                                                reader.readAsText(resFile);
                                                reader.onloadend = (evt: any) => {
                                                  this.fileContent = evt.target.result;
                                                  this.presentAlert('Succàs !', 'readFile terminé');
                                                  this.parseContent();
                                                }
                                              })
                                            }, err => this.presentAlert('Echec... !', 'erreur readFile ' + err)
    );
  }

  presentAlert(title: string, text: string) {
    let alert = this.alertController.create({
                                              title: title,
                                              subTitle: text,
                                              buttons: [ 'Ok' ]
                                            });
    alert.present();
  }

  parseEmbeddedFile() {
    let filename='../../assets/init/cavusvinifera-UTF-8-20170528.csv';
    var reader = new FileReader();
    let blob=new Blob();
    reader.readAsText(blob);
    reader.onloadend = (evt: any) => {
      this.fileContent = evt.target.result;
      this.parseContent();
    }
  }


  parseEmbeddedFile2() {
    this.fileContent = "nomCru;country_label;subregion_label;area_label;label;millesime;volume;date_achat;prix;cote;quantite_courante;quantite_achat;garde_min;garde_max;garde_optimum;suggestion;comment;lieu_achat;canal_vente\n" +
      "A. Chauvet - Cachet Rouge - Millésimé;France;Champagne;Champagne Grand Cru;blanc effervescent;2008;75 cl;11.03.16;28;28;2;3;2;10;2;;;salon de la gastro Annecy le vieux;En direct du producteur\n" +
      "A. Chauvet - Cachet Vert;France;Champagne;Champagne;blanc effervescent;-;75 cl;11.03.16;17.8;17.8;2;3;2;10;2;;à boire avant 2018;salon de la gastro Annecy le vieux;En direct du producteur";
    this.parseContent();
  }

  private parseContent() {
    let csvarray = this.fileContent.split('\n');
    let keys = _.first(csvarray).split(';');
    let values = _.drop(csvarray, 1);
    let asArrayOfObjects = _.map(values, function (row) {
      return buildObject(row, keys);
    }, {});
    this.presentAlert('Parsing terminé', 'Nombre d\'éléments trouvés:'+asArrayOfObjects.length);
    return asArrayOfObjects;
  }
}

function buildObject(row: any, keys: any) {
  let object = {};
  let values = row.split(';');
  _.each(keys, function (key, i) {
    if (i<values.length) {
      object[ key ] = values[ i ];
    } else {
      object[ key ] = '';
    }
  })
  return object;
}

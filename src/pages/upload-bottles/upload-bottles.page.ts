import {Component} from "@angular/core";
import {AlertController, IonicPage, NavController, NavParams} from "ionic-angular";
import {FileChooser} from "@ionic-native/file-chooser";
import {File} from "@ionic-native/file";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult} from "@ionic-native/barcode-scanner";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";

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
          this.presentAlert('Succàs !', 'readFile ' + this.fileContent);
        }
      })
    }, err => this.presentAlert('Echec... !', 'erreur readFile ' + err)
  );
    //
    //this.presentAlert('lecture', 'fichier: path=' + imagePath + ', nom=' + imageName);
    //this.file.readAsText(imagePath, imageName)
    //  .then(function (text) {
    //    //this.presentAlert('Succès !', text);
    //    this.fileContent = text;
    //  })
    //  .catch(function (err: TypeError) {
    //    this.presentAlert('Echec !', err.message);
    //    this.fileContent = err.message;
    //  });
    ////checkDir(this.file.dataDirectory, 'mydir').then(_ => console.log('Directory exists')).catch(err =>
    //// console.log('Directory doesnt exist'));
  }

  presentAlert(title: string, text: string) {
    let alert = this.alertController.create({
                                              title: title,
                                              subTitle: text,
                                              buttons: [ 'Ok' ]
                                            });
    alert.present();
  }

  //
  //upload() {
  //  let options: FileUploadOptions = {
  //    fileKey: 'file',
  //    fileName: 'name.jpg',
  //    headers: {}
  //  }
  //
  //  this.fileTransfer.upload('<file path>', '<api endpoint>', options)
  //    .then((data) => {
  //      // success
  //    }, (err) => {
  //      // error
  //    })
  //}
}

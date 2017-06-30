import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, ToastController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult} from '@ionic-native/barcode-scanner';
import {CavusService} from './cavus.service';
import {NotificationService} from '../../service/notification.service';

/**
 * Generated class for the UploadBottles page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
             selector: 'page-experiments',
             templateUrl: 'experiments.page.html'
           })
export class ExperimentsPage {
  qrCode: BarcodeScanResult;
  qrCodeText: string;
  images: Array<{ src: String }> = [];

  constructor(public navCtrl: NavController,
              private notificationService: NotificationService,
              private barcodeScanner: BarcodeScanner,
              private camera: Camera) {
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
    }, error => {
      this.notificationService.error('Error !', error);
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
      .catch(error => {
        this.notificationService.failed('Le scan a échoué: ' + error);
        this.qrCodeText = error;
      });
  }
}

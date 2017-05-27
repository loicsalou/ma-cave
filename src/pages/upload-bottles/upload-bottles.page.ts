import {Component} from "@angular/core";
import {AlertController, IonicPage, NavController, NavParams} from "ionic-angular";
import {FileUploadOptions, Transfer, TransferObject} from "@ionic-native/transfer";
import {FileChooser} from "@ionic-native/file-chooser";

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

  private fileTransfer: TransferObject = this.transfer.create();

  constructor(public navCtrl: NavController, public navParams: NavParams, private transfer: Transfer,
              private fileChooser: FileChooser, private alertController: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadBottles');
  }

  choose() {
    this.fileChooser.open()
      .then(uri => this.presentAlert('Succès !', 'l uri choisie est ' + uri))
      .catch(e => this.presentAlert('Echec... !', 'erreur ' + e));
  }

  presentAlert(title: string, text: string) {
    let alert = this.alertController.create({
                                        title: title,
                                        subTitle: text,
                                        buttons: ['Ok']
                                      });
    alert.present();
  }

  upload() {
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.jpg',
      headers: {}
    }

    this.fileTransfer.upload('<file path>', '<api endpoint>', options)
      .then((data) => {
        // success
      }, (err) => {
        // error
      })
  }
}

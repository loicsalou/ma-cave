///<reference path="../../../node_modules/ionic-angular/navigation/nav-controller.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Statistics} from '../../model/statistics';

@Component({
             selector: 'page-about',
             templateUrl: 'about.html',
             styleUrls: [
               '/about.scss'
             ]
           })
export class AboutPage implements OnInit {

  version: string;
  name: string;
  message: string;
  trad: string;
  private imagePath: string;
  stats: Statistics;

  images: Array<{ src: String }>;

  constructor(public navCtrl: NavController, private camera: Camera, public i18n: TranslateService) {
    this.images = [];
  }

  ngOnInit() {
    let json = require('../../../package.json');
    this.name = json.name;
    this.version = json.version;
  }

  choosePicture(event) {
    event.stopPropagation();
  }

  showTrads() {
    this.trad = this.i18n.instant('area_label');
  }

  removePicture(event) {
    event.stopPropagation();
    this.imagePath = null;
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: this.camera.EncodingType.JPEG,
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
      alert('ERROR ! ' + err);
    });
  }

}

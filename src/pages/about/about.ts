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

  constructor(public navCtrl: NavController, private camera: Camera, private platform: Platform,
              public i18n: TranslateService) {
    this.images = [];
  }

  ngOnInit() {
    let json = require('../../../package.json');
    this.name = json.name;
    this.version = json.version;
  }

  choosePicture(event) {
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
  }

  showTrads() {
    this.trad = this.i18n.instant('area_label');
  }

  removePicture(event) {
    event.stopPropagation();
    this.imagePath = null;
  }

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

///<reference path="../../../node_modules/ionic-angular/navigation/nav-controller.d.ts"/>
import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {Camera, ImagePicker, FilePath} from "ionic-native";
import {TranslateService} from "@ngx-translate/core";

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

  constructor(public navCtrl: NavController, public i18n: TranslateService) {
  }

  ngOnInit() {
    let json = require('../../../package.json');
    this.name = json.name;
    this.version = json.version;
  }

  onclick(event: any) {
    console.info('zone ' + event.currentTarget.title + ' cliquée');
    let options = {
      destinationType: Camera.DestinationType.FILE_URI,
      encodingType: Camera.EncodingType.PNG,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: Camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    Camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.message = 'image capturée ! ' +imageData;
    }, (err) => {
      console.error('Erreur lors de la prise de la photo !');
      this.message = 'Erreur lors de la prise de la photo ! ' + err;
    });
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
    ImagePicker.getPictures({maximumImagesCount: 3}).then((results) => {
        for (var i = 0; i < results.length; i++) {
          this.imagePath=results[i];
          this.message = this.imagePath;
        }
      }
      ,
      (err) => {
        this.message = "Erreur d'accès à la photo ! " + err;
      }
    )
    ;
  }

  showTrads() {
    this.trad=this.i18n.instant('area_label');
  }

  removePicture(event) {
    event.stopPropagation();
    this.imagePath = null;
  }
}

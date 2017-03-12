///<reference path="../../../node_modules/ionic-angular/navigation/nav-controller.d.ts"/>
import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {Camera, ImagePicker, FilePath} from "ionic-native";

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
  private imagePath: string;

  constructor(public navCtrl: NavController) {
  }

  ngOnInit() {
    let json = require('../../../package.json');
    this.name = json.name;
    this.version = json.version;
  }

  onclick(event: any) {
    console.info('zone ' + event.currentTarget.title + ' cliquée');
    let options = {
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: 1,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    Camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.message = 'image capturée !';
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
        FilePath.resolveNativePath(results[i])
          .then(filePath => {
            console.log("Chemin résolu " + filePath);
            this.message = this.imagePath;
          })
          .catch(err => this.message = err);
  }
}
,
(err) => {
  this.message = "Erreur d'accès à la photo ! " + err;
}
)
;
}

removePicture(event)
{
  event.stopPropagation();
  this.imagePath = null;
}
}

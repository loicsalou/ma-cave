///<reference path="../../../node_modules/ionic-angular/navigation/nav-controller.d.ts"/>
import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Camera} from "ionic-native";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: [
    '/about.scss'
  ]
})
export class AboutPage {

  constructor(public navCtrl: NavController) {
  }

  onclick(event: any) {
    console.info('zone ' + event.currentTarget.title + ' cliquée');
    let options = {};
    Camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.error('Erreur lors de la prise de la photo !');
    });
  }

}

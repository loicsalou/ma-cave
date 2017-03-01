///<reference path="../../../node_modules/ionic-angular/navigation/nav-controller.d.ts"/>
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

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
    console.info('zone '+event.currentTarget.title+' cliquée');
  }

}

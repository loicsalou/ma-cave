import {Component, OnInit} from '@angular/core';
import {ActionSheetController, NavController, Platform} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {StatisticsService} from '../../components/statistics/statistics-firebase.service';
import {Statistics} from '../../components/bottle/statistics';
import {LoginService} from './login.service';

@Component({
             selector: 'page-home',
             templateUrl: 'home.html',
             styleUrls: [ '/home.scss' ]
           })
export class HomePage implements OnInit {
  version: any;

  constructor(public navCtrl: NavController, public platform: Platform,
              public actionsheetCtrl: ActionSheetController, public loginService: LoginService) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
  }

  filterOnText(event: any) {
    let text = event.target.value;
    if (text != undefined && text.length != 0) {
      this.navCtrl.push(BrowsePage, {
        text: text
      })
    }
    ;
  }

  manageCellar() {
    // this.navCtrl.push(BrowsePage);
  }

  browseCellar() {
    this.navCtrl.push(BrowsePage);
  }
}

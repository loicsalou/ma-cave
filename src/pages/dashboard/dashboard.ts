import {Component, OnInit} from '@angular/core';
import {Modal, ModalController, NavController, Platform, ToastController} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {LoginService} from '../../service/login.service';
import {EmailLoginPage} from '../login/email-login.page';
import {User} from '../../model/user';
import {HomePage} from '../home/home';

@Component({
             selector: 'page-dashboard',
             templateUrl: 'dashboard.html',
             styleUrls: [ '/dashboard.scss' ]
           })
export class DashboardPage implements OnInit {
  version: any;

  constructor(public navCtrl: NavController, public platform: Platform,
              public toastController: ToastController, public loginService: LoginService,
              private modalController: ModalController) {
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
  }

  browseCellar() {
    this.navCtrl.push(BrowsePage);
  }

  logout() {
    this.loginService.logout();
    this.navCtrl.push(HomePage);
  }
}

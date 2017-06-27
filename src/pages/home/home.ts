import {Component, OnInit} from '@angular/core';
import {Modal, ModalController, NavController, Platform, ToastController} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {LoginService} from '../../service/login.service';
import {EmailLoginPage} from '../login/email-login.page';

@Component({
             selector: 'page-home',
             templateUrl: 'home.html',
             styleUrls: [ '/home.scss' ]
           })
export class HomePage implements OnInit {
  version: any;
  private loginPage: Modal;

  constructor(public navCtrl: NavController, public platform: Platform,
              public toastController: ToastController, public loginService: LoginService,
              private modalController: ModalController) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
  }

  facebookLogin() {
    this.loginService.facebookLogin();
  }

  emailLogin() {
    this.loginPage = this.modalController.create(EmailLoginPage);
    this.loginPage.present();
    this.loginService.authentifiedObservable.subscribe(user => {
      if (user) {
        this.loginPage.dismiss();
      }
    });
  }

  anonymousLogin() {
    this.loginService.anonymousLogin();
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
}

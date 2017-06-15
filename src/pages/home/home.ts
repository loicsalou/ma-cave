import {Component, OnInit} from '@angular/core';
import {NavController, Platform, ToastController} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {LoginService} from './login.service';

@Component({
             selector: 'page-home',
             templateUrl: 'home.html',
             styleUrls: [ '/home.scss' ]
           })
export class HomePage implements OnInit {
  version: any;
  loginOK = false;
  user: string;
  psw: string;

  constructor(public navCtrl: NavController, public platform: Platform,
              public toastController: ToastController, public loginService: LoginService) {
    this.loginService.authentified.subscribe(user => {
      this.loginOK = true;
      this.toast('l\'utilisateur ' + user + ' a bien été identifié');
    })
  }

  public signin() {
    this.loginService.authentified.subscribe(user => this.loginOK = true);
    this.loginService.user=this.user;
    this.loginService.psw=this.psw;
    this.loginService.login();
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

  private toast(message) {
    let basketToast = this.toastController.create({
                                                    message: message,
                                                    cssClass: 'info-message',
                                                    showCloseButton: true
                                                  });
    basketToast.present();
  }

  manageCellar() {
    // this.navCtrl.push(BrowsePage);
  }

  browseCellar() {
    this.navCtrl.push(BrowsePage);
  }
}

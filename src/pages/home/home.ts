import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Modal, ModalController, NavController, Platform} from 'ionic-angular';
import {LoginService} from '../../service/login.service';
import {EmailLoginPage} from '../login/email-login.page';
import {User} from '../../model/user';
import {TabsPage} from '../tabs/tabs';
import {Subscription} from 'rxjs/Subscription';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LocalLoginPage} from '../login/local-login.page';
import * as _ from 'lodash';

@Component({
             selector: 'page-home',
             templateUrl: 'home.html',
             styleUrls: [ '/home.scss' ]
           })
export class HomePage implements OnInit, AfterViewInit {

  version: any;
  private loginPage: Modal;

  private authenticated = false;
  private loginSubscription: Subscription;

  constructor(public navCtrl: NavController, public platform: Platform, public loginService: LoginService,
              private modalController: ModalController, private splashScreen: SplashScreen) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
  }

  ngAfterViewInit(): void {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  facebookLogin() {
    this.loginService.facebookLogin();
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
      if (user) {
        this.authenticated = true;
      }
    });
  }

  emailLogin() {
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
      if (user) {
        this.loginPage.dismiss();
      }
    });
    this.loginPage = this.modalController.create(EmailLoginPage);
    this.loginPage.present();
  }

  localLogin() {
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
      if (user) {
        this.loginPage.dismiss();
      }
    });
    this.loginPage = this.modalController.create(LocalLoginPage);
    this.loginPage.present();
  }

  anonymousLogin() {
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
    });
    this.loginService.anonymousLogin();
  }

  logout() {
    this.loginService.logout();
  }

  private handleLoginEvent(user: User) {
    this.authenticated = (user !== undefined);
    if (this.authenticated) {
      this.navCtrl.push(TabsPage);
    }
    else if (this.navCtrl.length() > 1) {
      this.navCtrl.popToRoot();
      this.loginSubscription.unsubscribe();
    }
  }
}

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Modal, ModalController, NavController, Platform} from 'ionic-angular';
import {LoginService} from '../../service/login/login.service';
import {EmailLoginPage} from '../../_features/admin/login/email-login.page';
import {User} from '../../model/user';
import {TabsPage} from '../tabs/tabs';
import {Subscription} from 'rxjs/Subscription';
import {LocalLoginPage} from '../../_features/admin/login/local-login.page';
import {NotificationService} from '../../service/notification.service';
import {NativeProvider} from '../../providers/native/native';

@Component({
             selector: 'page-home',
             templateUrl: 'home.html'
             // styleUrls:[ 'home.scss' ]
           })
export class HomePage implements OnInit, AfterViewInit {

  version: any;
  private loginPage: Modal;

  private authenticated = false;
  private loginSubscription: Subscription;

  constructor(public navCtrl: NavController, public loginService: LoginService,
              private modalController: ModalController,
              private notificationService: NotificationService,
              private nativeProvider: NativeProvider, private platform: Platform) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
  }

  ngAfterViewInit(): void {
    this.nativeProvider.initNativeFeatures(this.navCtrl);
  }

  facebookLogin() {
    this.nativeProvider.feedBack();
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
    });
    this.loginService.facebookLogin();
  }

  emailLogin() {
    this.nativeProvider.feedBack();
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
    this.nativeProvider.feedBack();
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
      if (user) {
        this.loginPage.dismiss();
      }
    });
    this.loginPage = this.modalController.create(LocalLoginPage);
    this.loginPage.present();
  }

  googleLogin() {
    this.nativeProvider.feedBack();
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
    });
    this.loginService.googleLogin();
  }

  anonymousLogin() {
    this.nativeProvider.feedBack();
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
    });
    this.loginService.anonymousLogin();
  }

  setDebugMode(b: boolean) {
    this.notificationService.debugMode = b;
  }

  isConnectionAllowed(): boolean {
    //return this.dataConnection.isConnectionAllowed();
    return true;
  }

  isGoogleLoginEnabled(): boolean {
    return !this.platform.is('cordova');
  }

  logout() {
    this.loginService.logout();
  }

  private handleLoginEvent(user: User) {
    this.authenticated = (user !== undefined);
    if (this.authenticated) {
      // login ok ==> dashboard
      this.navCtrl.setRoot(TabsPage);
    }
    else {
      // logout ==> retour à la page de login
      this.navCtrl.setRoot(HomePage);
      // pas de onDestroy ici car après un logout on reste quand même sur le home
      // ==> il faut faire l'unsubscribe à la main
      this.loginSubscription.unsubscribe();
    }
  }
}

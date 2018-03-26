import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Modal, ModalController, NavController, Platform} from 'ionic-angular';
import {LoginService} from '../../service/login.service';
import {EmailLoginPage} from '../../_features/admin/login/email-login.page';
import {User} from '../../model/user';
import {TabsPage} from '../tabs/tabs';
import {Subscription} from 'rxjs/Subscription';
import {LocalLoginPage} from '../../_features/admin/login/local-login.page';
import {FirebaseConnectionService} from '../../service/firebase-connection.service';
import {NotificationService} from '../../service/notification.service';
import {DeviceFeedback} from '@ionic-native/device-feedback';
import {NativeProvider} from '../../providers/native/native';

@Component({
             selector: 'page-home',
             templateUrl: 'home.html',
             // styleUrls:[ 'home.scss' ]
           })
export class HomePage implements OnInit, AfterViewInit {

  version: any;
  private loginPage: Modal;

  private authenticated = false;
  private loginSubscription: Subscription;
  private fbidentifying: boolean = false;
  private mailidentifying: boolean = false;
  private locidentifying: boolean = false;
  private anoidentifying: boolean = false;

  constructor(public navCtrl: NavController, public loginService: LoginService,
              private modalController: ModalController, private deviceFeedBack: DeviceFeedback,
              private notificationService: NotificationService, private dataConnection: FirebaseConnectionService,
              private nativeProvider: NativeProvider, private platform: Platform) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
  }

  ngAfterViewInit(): void {
    this.nativeProvider.initNativeFeatures(this.navCtrl);
  }

  facebookLogin() {
    this.fbidentifying = true;
    this.nativeProvider.feedBack();
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
      this.fbidentifying = false;
    });
    this.loginService.facebookLogin();
  }

  emailLogin() {
    this.mailidentifying = true;
    this.nativeProvider.feedBack();
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
      if (user) {
        this.loginPage.dismiss();
        this.mailidentifying = false;
      }
    });
    this.loginPage = this.modalController.create(EmailLoginPage);
    this.loginPage.present();
  }

  localLogin() {
    this.locidentifying = true;
    this.nativeProvider.feedBack();
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
      if (user) {
        this.loginPage.dismiss();
        this.locidentifying = false;
      }
    });
    this.loginPage = this.modalController.create(LocalLoginPage);
    this.loginPage.present();
  }

  googleLogin() {
    this.locidentifying = true;
    this.nativeProvider.feedBack();
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
    });
    this.loginService.googleLogin();
  }

  anonymousLogin() {
    this.anoidentifying = true;
    this.nativeProvider.feedBack();
    this.loginSubscription = this.loginService.authentifiedObservable.subscribe(user => {
      this.handleLoginEvent(user);
      this.anoidentifying = false;
    });
    this.loginService.anonymousLogin();
  }

  setDebugMode(b: boolean) {
    this.notificationService.debugMode = b;
  }

  isConnectionAllowed(): boolean {
    return this.dataConnection.isConnectionAllowed();
  }

  isGoogleLoginEnabled(): boolean {
    return !this.platform.is('cordova');
  }

  connectionAllowed() {
    this.dataConnection.setConnectionAllowed(true);
  }

  connectionDisallowed() {
    this.dataConnection.setConnectionAllowed(false);
  }

  logout() {
    this.loginService.logout();
  }

  private handleLoginEvent(user: User) {
    this.authenticated = (user !== undefined);
    if (this.authenticated) {
      this.navCtrl.setRoot(TabsPage);
    }
    else {
      this.navCtrl.setRoot(HomePage);
      // pas de onDestroy ici car après un logout on reste quand même sur le home ==> il faut faire l'unsubscribe à
      // la main
      this.loginSubscription.unsubscribe();
    }
  }
}

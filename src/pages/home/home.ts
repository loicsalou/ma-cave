import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Modal, ModalController, NavController, Platform} from 'ionic-angular';
import {LoginService} from '../../service/login.service';
import {EmailLoginPage} from '../login/email-login.page';
import {User} from '../../model/user';
import {TabsPage} from '../tabs/tabs';
import {Subscription} from 'rxjs/Subscription';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LocalLoginPage} from '../login/local-login.page';
import {FirebaseConnectionService} from '../../service/firebase-connection.service';
import {NotificationService} from '../../service/notification.service';
import {DeviceFeedback} from '@ionic-native/device-feedback';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {NativeProvider} from '../../providers/native/native';

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
  private fbidentifying: boolean = false;
  private mailidentifying: boolean = false;
  private locidentifying: boolean = false;
  private anoidentifying: boolean = false;

  constructor(public navCtrl: NavController, public loginService: LoginService,
              private modalController: ModalController, private deviceFeedBack: DeviceFeedback,
              private notificationService: NotificationService, private dataConnection: FirebaseConnectionService,
              private nativeProvider: NativeProvider) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
  }

  ngAfterViewInit(): void {
    this.nativeProvider.initNativeFeatures();
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
      this.enableExitOnConfirm();
    }
  }
}

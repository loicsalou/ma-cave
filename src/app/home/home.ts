import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Modal, ModalController, NavController, Platform} from 'ionic-angular';
import {LoginService} from '../../service/login/login.service';
import {EmailLoginPage} from '../../_features/admin/login/email-login.page';
import {User} from '../../model/user';
import {TabsPage} from '../tabs/tabs';
import {Subscription, Observable} from 'rxjs';
import {NotificationService} from '../../service/notification.service';
import {NativeProvider} from '../../providers/native/native';
import {VERSION} from '../../_features/admin/version';
import {ApplicationState} from '../state/app.state';
import {Store} from '@ngrx/store';
import {LoadBottlesAction} from '../state/bottles.actions';
import {LogoutAction} from '../state/shared.actions';
import {SharedQuery} from '../state/shared.state';
import {map, tap} from 'rxjs/operators';

@Component({
             selector: 'page-home',
             templateUrl: 'home.html',
             changeDetection: ChangeDetectionStrategy.OnPush
             // styleUrls:[ 'home.scss' ]
           })
export class HomePage implements OnInit, AfterViewInit {

  version: any;
  currentTheme$: Observable<string>;

  private loginPage: Modal;

  private loginSubscription: Subscription;
  private loggedIn = false;

  constructor(public navCtrl: NavController, public loginService: LoginService,
              private modalController: ModalController,
              private notificationService: NotificationService,
              private nativeProvider: NativeProvider, private platform: Platform,
              private store: Store<ApplicationState>) {
    this.loginSubscription = this.store.select(SharedQuery.getLoginUser).pipe(
      tap(() => {
        if (this.loginPage) {
          this.loginPage.dismiss();
        }
      })
    ).subscribe((user: User) =>
                  this.handleLoginEvent(user)
    );
    this.currentTheme$ = this.store.select(SharedQuery.getSharedState).pipe(
      map(state =>
            state.theme ? state.theme : 'cavus-theme')
    );
  }

  ngOnInit(): void {
    this.version = VERSION;
  }

  ngAfterViewInit(): void {
    this.nativeProvider.initNativeFeatures(this.navCtrl);
  }

  facebookLogin() {
    this.nativeProvider.feedBack();
    this.loginService.facebookLogin();
  }

  emailLogin() {
    this.nativeProvider.feedBack();
    this.loginPage = this.modalController.create(EmailLoginPage);
    this.loginPage.present();
  }

  googleLogin() {
    this.nativeProvider.feedBack();
    this.loginService.googleLogin();
  }

  anonymousLogin() {
    this.nativeProvider.feedBack();
    this.loginService.anonymousLogin();
  }

  setDebugMode(b: boolean) {
    this.notificationService.debugMode = b;
  }

  isGoogleLoginEnabled(): boolean {
    return !this.platform.is('cordova');
  }

  logout() {
    this.store.dispatch(new LogoutAction());
  }

  private handleLoginEvent(user: User) {
    if (user !== undefined) {
      this.loggedIn = true;
      this.store.dispatch(new LoadBottlesAction());
      this.navCtrl.setRoot(TabsPage);
    }
    else {
      // logout ==> retour à la page de login
      if (this.loggedIn) {
        this.navCtrl.setRoot(HomePage);
        this.loginSubscription.unsubscribe();
      }
    }
  }
}

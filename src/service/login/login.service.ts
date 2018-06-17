import {Subscription} from 'rxjs';
import {User} from '../../model/user';
import {AnonymousLoginService} from './anonymous-login.service';
import {EmailLoginService} from './email-login.service';
import {FacebookLoginService} from './facebook-login.service';
import {AbstractLoginService} from './abstract-login.service';
import {GoogleLoginService} from './google-login.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../app/state/app.state';
import {LoginSuccessAction} from '../../app/state/shared.actions';
import {TranslateService} from '@ngx-translate/core';
import {AlertController} from 'ionic-angular';
import {FacebookLoginNativeService} from './facebook-login-native.service';
import {logInfo} from '../../utils';
import {OnDestroy} from '@angular/core';
import * as firebase from 'firebase/app';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {traced} from '../../utils/decorators';

export type LOGINTYPE = 'FACEBOOK' | 'EMAIL' | 'ANONYMOUS' | 'FACEBOOK_NATIVE' | 'GOOGLE';

/**
 * Created by loicsalou on 13.06.17.
 */
export class LoginService implements OnDestroy {
  private loginSub: Subscription;
  private currentLoginService: AbstractLoginService;
  private _user: User;

  constructor(private anoLogin: AnonymousLoginService,
              private mailLogin: EmailLoginService,
              private fbLogin: FacebookLoginService,
              private fbLoginNative: FacebookLoginNativeService,
              private gglLogin: GoogleLoginService,
              private translateService: TranslateService,
              private alertController: AlertController,
              private store: Store<ApplicationState>) {
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  @traced
  createAccount(user: string, psw: string) {
    this.currentLoginService = this.mailLogin;
    this.currentLoginService.createAccount(user, psw);
  }

  @traced
  deleteAccount() {
    this.currentLoginService.deleteAccount();
  }

  @traced
  resetEmailPassword(user: string) {
    this.currentLoginService = this.mailLogin;
    this.currentLoginService.resetPassword(user);
  }

  @traced
  anonymousLogin(): Observable<User> {
    this.currentLoginService = this.anoLogin;
    return this.anoLogin.login();
  }

  @traced
  googleLogin(): Observable<User> {
    this.currentLoginService = this.gglLogin;
    return this.gglLogin.login();
  }

  @traced
  emailLogin(login: string, psw: string): Observable<User> {
    this.currentLoginService = this.mailLogin;
    this.mailLogin.username = login;
    this.mailLogin.psw = psw;
    return this.mailLogin.login();
  }

  @traced
  facebookLogin(): Observable<User> {
    this.currentLoginService = this.fbLogin;
    return this.fbLogin.login();
  }

  @traced
  facebookNativeLogin(): Observable<User> {
    this.currentLoginService = this.fbLoginNative;
    return this.fbLoginNative.login();
  }

  @traced
  login(type: LOGINTYPE, user?: string, password?: string):Observable<User> {
    switch (type) {
      case 'ANONYMOUS':
        return this.anonymousLogin();
      case 'FACEBOOK':
        return this.facebookLogin();
      case 'FACEBOOK_NATIVE':
        return this.facebookNativeLogin();
      case 'GOOGLE':
        return this.googleLogin();
      case 'EMAIL':
        return this.emailLogin(user, password);

      default:
        throw new Error('Type de login non supporté');
    }
  }

  @traced
  logout() {
    firebase.auth().signOut();
    this.currentLoginService.logout();
  }

  @traced
  private failed(message: string, error?: any) {
    let msg = this.translateService.instant(message);
    this.alertController.create({
                                  title: this.translateService.instant('app.failed'),
                                  subTitle: msg + (error ? error : ''),
                                  buttons: [ 'Ok' ]
                                })
      .present();
  }

}

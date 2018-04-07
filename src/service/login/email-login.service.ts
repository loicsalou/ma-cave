/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../../model/user';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from '../notification.service';

@Injectable()
export class EmailLoginService extends AbstractLoginService {

  private _username: string;
  private _psw: string;

  constructor(notificationService: NotificationService) {
    super(notificationService);
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get psw(): string {
    return this._psw;
  }

  set psw(value: string) {
    this._psw = value;
  }

  createAccount(user: any, pass: any) {
    let self = this;
    let popup = this.notificationService.createLoadingPopup('creating-account');
    firebase.auth().createUserWithEmailAndPassword(user, pass)
      .then(() => {
              var fbuser = firebase.auth().currentUser;
              fbuser.sendEmailVerification().then(function () {
                self.notificationService.information('app.email-sent');
              }).catch(function (error) {
                self.notificationService.information('app.email-failed');
              });
              popup.dismiss();
            }
      ).catch(err => {
                if (err[ 'code' ] === 'auth/email-already-in-use') {
                  self.notificationService.error('app.email-already-used');
                } else {
                  self.notificationService.error(err.message);
                }
                popup.dismiss();
                self.logout();
              }
    );
  }

  resetPassword(user: string) {
    let self = this;
    let popup = this.notificationService.createLoadingPopup('resetting-password');
    var auth = firebase.auth();

    auth.sendPasswordResetEmail(user).then(function () {
      self.notificationService.information('app.email-sent');
      popup.dismiss();
    }).catch(function (error) {
      self.notificationService.error('app.email-failed', error);
      popup.dismiss();
    });
  }

  protected delegatedLogin(authObs: Observable<User>): Observable<User> {
    let self = this;
    let popup = this.notificationService.createLoadingPopup('app.checking-login');
    firebase.auth().signInWithEmailAndPassword(this.username, this.psw)
      .then(
        token => {
          let displayName = token[ 'displayName' ];
          let email = token[ 'email' ];
          self.success(new EmailLoginUser(this.username, email, displayName, null));
          popup.dismiss();
        }
      )
      .catch(function (error) {
        self.loginFailed();
        self.logout();
        popup.dismiss();
      });

    return authObs;
  }
}

export class EmailLoginUser extends User {
  constructor(user: string, email: string, displayName: string, photoUrl: string) {
    super();
    this.user = user.replace(/[\.]/g, '');
    this.user = this.user.replace(/[#.]/g, '');
    this.email = email;
    this.photoURL = undefined;
    this.displayName = displayName ? displayName : email.split('@')[ 0 ];
    this.uid = undefined;
    this.phoneNumber = undefined;
    this.loginType = 'email';
  }
}



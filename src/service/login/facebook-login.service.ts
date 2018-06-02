/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../../model/user';
import {from, Observable} from 'rxjs';
import {NotificationService} from '../notification.service';
import {AuthService} from 'angularx-social-login';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {logInfo} from '../../utils';
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;

@Injectable()
export class FacebookLoginService extends AbstractLoginService {
  userString: string;

  constructor(notificationService: NotificationService, private authService: AuthService, firebaseAuth: AngularFireAuth) {
    super(notificationService, firebaseAuth);
  }

  protected delegatedLogin(): Observable<User> {
    let provider = new FacebookAuthProvider();
    let self = this;
    firebase.auth().useDeviceLanguage();
    let popup = this.notificationService.createLoadingPopup('app.checking-login');
    return from(firebase.auth().signInWithPopup(provider).then(function (result) {
      let socialUser = result.user;
      let fbuser = new FacebookUser(socialUser.email, socialUser.photoUrl,
        socialUser.firstName + ' ' + socialUser.lastName, socialUser.id, '');
      popup.dismiss();
      self.success(fbuser);
      return fbuser;
    }, (rejectReason: any) => {
      popup.dismiss();
      this.notificationService.error('login failed: ' + rejectReason);
      self.loginFailed();
      return undefined;
    }).catch(function (error) {
      popup.dismiss();
      self.loginFailed();
      self.logout();
      return undefined;
    }));
  }
}

export class FacebookUser extends User {
  //constructor(user: string, email: string, photoURL: string, displayName: string, uid: string, phoneNumber: string) {
  //  super();
  //  this.provider = 'facebook';
  //  this.user = email.replace(/[\.]/g, '');
  //  this.user = this.user.replace(/[#.]/g, '');
  //  this.email = email;
  //  this.photoURL = photoURL;
  //  this.uid = uid;
  //  this.phoneNumber = phoneNumber;
  //  this.displayName = displayName;
  //  this.loginType = 'facebook';
  //  logInfo('facebook user built: ' + JSON.stringify(this));
  //}
  constructor(email: string, photoURL: string, displayName: string, uid: string, phoneNumber: string) {
    super();
    this.user = email.replace(/[\.]/g, '');
    this.user = this.user.replace(/[#.]/g, '');
    this.email = email;
    this.photoURL = photoURL;
    this.uid = uid;
    this.phoneNumber = phoneNumber;
    this.displayName = displayName;
    this.loginType = 'google';
  }

}

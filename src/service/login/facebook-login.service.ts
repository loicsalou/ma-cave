/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../../model/user';
import {from, Observable} from 'rxjs';
import {NotificationService} from '../notification.service';
import {AuthService, FacebookLoginProvider, SocialUser} from 'angularx-social-login';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {switchMap, take, tap} from 'rxjs/operators';
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;

@Injectable()
export class FacebookLoginService extends AbstractLoginService {
  userString: string;
  private socialUser: SocialUser;

  constructor(notificationService: NotificationService, private authService: AuthService, firebaseAuth: AngularFireAuth) {
    super(notificationService, firebaseAuth);
  }

  protected delegatedLogin(): Observable<User> {
    const fbLogin = from(this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
                           .then(user => {
                             //alert('User authentifié: ' + user.email);
                             this.socialUser = user;
                             return new FacebookUser(user.name, user.email, user.photoUrl,
                               user.firstName + ' ' + user.lastName, user.id, '');
                           })
                           .catch(err => {
                             //alert('erreur d\'authentification ' + err);
                             return null;
                           }));
    return fbLogin.pipe(
      switchMap((user: FacebookUser) => this.loginToFirebase(user)),
      take(1)
    );
  }

  protected loginToFirebase(fbUser: FacebookUser): Observable<User> {
    let provider = new FacebookAuthProvider();
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(this.socialUser.authToken);
    firebase.auth().useDeviceLanguage();
    let popup = this.notificationService.createLoadingPopup('app.checking-login');
    return from(firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential).then((result) => {
      popup.dismiss();
      this.success(fbUser);
      return fbUser;
    }, (rejectReason: any) => {
      popup.dismiss();
      this.notificationService.error('login failed: ' + rejectReason);
      this.loginFailed();
      return undefined;
    }).catch(function (error) {
      popup.dismiss();
      this.loginFailed();
      this.logout();
      return undefined;
    }));
  }
}

export class FacebookUser extends User {
  constructor(user: string, email: string, photoURL: string, displayName: string, uid: string, phoneNumber: string) {
    super();
    this.user = email.replace(/[\.]/g, '');
    this.user = this.user.replace(/[#.]/g, '');
    this.email = email;
    this.photoURL = photoURL;
    this.uid = uid;
    this.phoneNumber = phoneNumber;
    this.displayName = displayName;
    this.loginType = 'facebook';
  }
  //constructor(email: string, photoURL: string, displayName: string, uid: string, phoneNumber: string) {
  //  super();
  //  this.user = email.replace(/[\.]/g, '');
  //  this.user = this.user.replace(/[#.]/g, '');
  //  this.email = email;
  //  this.photoURL = photoURL;
  //  this.uid = uid;
  //  this.phoneNumber = phoneNumber;
  //  this.displayName = displayName;
  //  this.loginType = 'google';
  //}

}

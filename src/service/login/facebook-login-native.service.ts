/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {AbstractLoginService} from './abstract-login.service';
import {Facebook} from '@ionic-native/facebook';
import {User} from '../../model/user';
import {Observable, from} from 'rxjs';
import {NotificationService} from '../notification.service';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class FacebookLoginNativeService extends AbstractLoginService {
  userString: string;

  constructor(notificationService: NotificationService, private facebook: Facebook, firebaseAuth: AngularFireAuth) {
    super(notificationService, firebaseAuth);
  }

  protected delegatedLogin(): Observable<User> {
    let self = this;
    let popup = this.notificationService.createLoadingPopup('app.checking-login');
    return from(self.facebook.login([ 'email' ]).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      return firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential)
        .then((success) => {
          let user: User = new FacebookUser(success.user, success.email, success.photoURL,
                                            success.displayName, success.uid, success.phoneNumber);
          self.success(user);
          popup.dismiss();
          return user;
        })
        .catch(error => {
          popup.dismiss();
          self.logout();
          self.notificationService.failed('l\'authentification a échoué (Promise.catch)', error);
          return undefined;
        })
    }).catch(
      error => {
        popup.dismiss();
        self.logout();
        self.notificationService.failed('l\'authentification a échoué (catch)', error);
        return undefined;
      }
    ));
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

}

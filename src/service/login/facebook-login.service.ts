/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {AbstractLoginService} from './abstract-login.service';
import {Facebook} from '@ionic-native/facebook';
import {User} from '../../model/user';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from '../notification.service';

@Injectable()
export class FacebookLoginService extends AbstractLoginService {
  userString: string;

  constructor(notificationService: NotificationService, private facebook: Facebook) {
    super(notificationService);
  }

  protected delegatedLogin(authObs: Observable<User>): Observable<User> {
    let self = this;
    let popup = this.notificationService.createLoadingPopup('app.checking-login');
    self.facebook.login([ 'email' ]).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          let user: User = new FacebookUser(success.user, success.email, success.photoURL,
                                            success.displayName, success.uid, success.phoneNumber);
          self.success(user);
          popup.dismiss();
        })
        .catch(error => {
          popup.dismiss();
          self.logout();
          self.notificationService.failed('l\'authentification a échoué (Promise.catch)', error);
        })
    }).catch(
      error => {
        popup.dismiss();
        self.logout();
        self.notificationService.failed('l\'authentification a échoué (catch)', error);
      }
    );

    return authObs;
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

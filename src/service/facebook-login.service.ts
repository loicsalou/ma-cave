/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {AbstractLoginService} from './abstract-login.service';
import {Facebook} from '@ionic-native/facebook';
import {User} from '../model/user';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from './notification.service';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class FacebookLoginService extends AbstractLoginService {
  userString: string;

  constructor(notificationService: NotificationService, private facebook: Facebook) {
    super(notificationService);
  }

  public login(): Observable<User> {
    let loadingPopup = this.notificationService.createLoadingPopup('app.checking-login');

    this.facebook.login([ 'email' ]).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          let user: User = new FacebookUser(success.user, success.email, success.photoURL,
                                            success.displayName, success.uid, success.phoneNumber);
          this.success(user);
          loadingPopup.dismiss();
        })
        .catch(error => {
          loadingPopup.dismiss();
          this.loginFailed();
          this.notificationService.failed('l\'authentification a échoué (Promise.catch)', error);
        })
    }).catch(
      error => {
        loadingPopup.dismiss();
        this.loginFailed();
        this.notificationService.failed('l\'authentification a échoué (catch)', error);
      }
    );

    return this.authentifiedObservable;
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
  }

}

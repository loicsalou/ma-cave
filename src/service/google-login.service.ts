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
export class GoogleLoginService extends AbstractLoginService {
  userString: string;

  constructor(notificationService: NotificationService) {
    super(notificationService);
  }

  protected delegatedLogin(authObs: Observable<User>): Observable<User> {
    let provider = new firebase.auth.GoogleAuthProvider();
    let self = this;
    firebase.auth().useDeviceLanguage();
    let popup = this.notificationService.createLoadingPopup('app.checking-login');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      let token = result.credential.accessToken;
      // The signed-in user info.
      let user = result.user;
      let googleUser=new GoogleUser(user.email, user.photoURL, user.displayName, user.uid, user.phoneNumber);
      // close popup
      popup.dismiss();
      self.success(googleUser)
    }).catch(function(error) {
      // Handle Errors here.
      let errorCode = error['code'];
      let errorMessage = error['message'];
      // The email of the user's account used.
      let email = error['email'];
      // The firebase.auth.AuthCredential type that was used.
      let credential = error['credential'];
      // close popup
      popup.dismiss();
      self.loginFailed();
      self.logout();

    });
    return authObs;
  }
}

export class GoogleUser extends User {

  constructor(email: string, photoURL: string, displayName: string, uid: string, phoneNumber: string) {
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

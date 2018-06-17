/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../../model/user';
import {from, Observable, of} from 'rxjs';
import {NotificationService} from '../notification.service';
import {Platform} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {AuthService, GoogleLoginProvider} from 'angularx-social-login';
import {logInfo} from '../../utils';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class GoogleLoginService extends AbstractLoginService {
  userString: string;

  constructor(notificationService: NotificationService, private platform: Platform, private authService: AuthService,
              firebaseAuth: AngularFireAuth) {
    super(notificationService, firebaseAuth);
  }

  /**
   * Experimental: en mode PWA ce login ne fonctionne pas ou mal (le popup ne se ferme jamais)
   */
  public socialLogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(user => {
        alert('gglologin success ! ' + JSON.stringify(user));
      })
      .catch(err => {
        this.authService.authState
        //.pipe(
        //  filter(user => user !== undefined)
        //)
          .subscribe(
            user => {
              alert('gglologin success via obs ! ' + JSON.stringify(user));
              firebase.auth().signInAndRetrieveDataWithCustomToken(user.idToken).then(function (result) {
                let user = result.user;
                let googleUser = new GoogleUser(user.email, user.photoURL, user.displayName, user.uid, user.phoneNumber);
                // close popup
                alert('firebase login OK ' + JSON.stringify(user));
                return googleUser;
              }, (rejectReason: any) => {
                this.notificationService.error('firebase login failed: ' + rejectReason);
                return null;
              });
            }
          );
        //alert('gglologin failed ! ' + JSON.stringify(err));
      });
  }

  protected delegatedLoginExperiment(): Observable<User> {
    openPopup();
    return of(null);
  }

  protected delegatedLogin(): Observable<User> {
    let provider = new GoogleAuthProvider();
    let self = this;
    firebase.auth().useDeviceLanguage();
    let popup = this.notificationService.createLoadingPopup('app.checking-login');
    return from(firebase.auth().signInWithPopup(provider).then(function (result) {
      let user = result.user;
      let googleUser = new GoogleUser(user.email, user.photoURL, user.displayName, user.uid, user.phoneNumber);
      // close popup
      popup.dismiss();
      self.success(googleUser);
      return googleUser;
    }, (rejectReason: any) => {
      popup.dismiss();
      this.notificationService.error('login failed: ' + rejectReason);
      self.loginFailed();
      return null;
    }).catch(function (error) {
      popup.dismiss();
      self.loginFailed();
      self.logout();
      return null;
    }));
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
    this.loginType = 'google';
  }

}

let popup;

// 3. update html when event is detected
function updateAuthInfo(e) {
  logInfo((JSON.stringify(e)));

  // 4. close popup
  popup.close();
}

function openPopup() {
  // 1. open popup window
  popup = window.open('popup.html', 'mywindow', 'width=350,height=250');

// 2. listen for message from popup
  window.addEventListener('message', updateAuthInfo);
}

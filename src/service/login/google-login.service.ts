/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../../model/user';
import {Observable, from, of} from 'rxjs';
import {NotificationService} from '../notification.service';
import {Platform} from 'ionic-angular';
import {auth} from 'firebase/app';
import {GooglePlus} from '@ionic-native/google-plus'; //needed for the GoogleAuthProvider
import * as firebase from 'firebase/app';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {AngularFireAuth} from 'angularfire2/auth';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class GoogleLoginService extends AbstractLoginService {
  userString: string;

  constructor(notificationService: NotificationService, private platform: Platform, private googlePlus: GooglePlus,
              firebaseAuth: AngularFireAuth) {
    super(notificationService, firebaseAuth);
  }

  loginWithCordova(): Observable<User> {
    return Observable.create(observer => {
      //alert('login with cordova 1');
      return this.googlePlus.login({
                                     //your Android reverse client id
                                     'webClientId': '58435015061-8bnsnki77q4ffi25ph5plr6m694866vd.apps.googleusercontent.com'
                                   }).then(userData => {
        //alert('login with cordova OK token='+userData.idToken);
        const token = userData.idToken;
        const googleCredential = auth.GoogleAuthProvider.credential(token, null);
        firebase.auth().signInAndRetrieveDataWithCredential(googleCredential).then((success) => {
          //alert('firebase signin with credential OK');
          let fbUser = firebase.auth().currentUser;
          let ggUser = new GoogleUser(fbUser.email, fbUser.photoURL, fbUser.displayName, fbUser.uid, fbUser.phoneNumber);
          observer.next(ggUser);
        }).catch(error => {
          observer.error(error);
        });
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  protected delegatedLogin(): Observable<User> {
    let provider = new GoogleAuthProvider();
    let self = this;
    firebase.auth().useDeviceLanguage();
    let popup = this.notificationService.createLoadingPopup('app.checking-login');
    if (this.platform.is('cordova')) {
      return this.loginWithCordova();
    } else {
      return from(firebase.auth().signInWithPopup(provider).then(function (result) {
        let user = result.user;
        let googleUser = new GoogleUser(user.email, user.photoURL, user.displayName, user.uid, user.phoneNumber);
        popup.dismiss();
        self.success(googleUser);
        return googleUser;
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

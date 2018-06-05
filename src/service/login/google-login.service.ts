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
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import {switchMap, take} from 'rxjs/operators';
import {AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser} from 'angularx-social-login';
import {FacebookUser} from './facebook-login.service';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class GoogleLoginService extends AbstractLoginService {
  userString: string;
  private socialUser: SocialUser;

  constructor(notificationService: NotificationService, private platform: Platform, private authService: AuthService,
              firebaseAuth: AngularFireAuth) {
    super(notificationService, firebaseAuth);
  }

  protected delegatedLogin(): Observable<User> {
    const gglLogin = from(this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
                           .then(user => {
                             this.socialUser = user;
                             return new GoogleUser(user.email, user.photoUrl,
                               user.firstName + ' ' + user.lastName, user.id, '');
                           })
                           .catch(err => {
                             return null;
                           }));
    return gglLogin.pipe(
      switchMap((user: GoogleUser) => this.loginToFirebase(user)),
      take(1)
    );
  }

  protected loginToFirebase(gglUser: GoogleUser): Observable<User> {
    let provider = new GoogleAuthProvider();
    const gglCredential = firebase.auth.GoogleAuthProvider.credential(this.socialUser.authToken);
    firebase.auth().useDeviceLanguage();
    let popup = this.notificationService.createLoadingPopup('app.checking-login');
    return from(firebase.auth().signInAndRetrieveDataWithCredential(gglCredential).then((result) => {
      popup.dismiss();
      this.success(gglUser);
      return gglUser;
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

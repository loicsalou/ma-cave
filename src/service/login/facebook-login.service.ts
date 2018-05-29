/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../../model/user';
import {Observable} from 'rxjs';
import {NotificationService} from '../notification.service';
import {AuthService, FacebookLoginProvider, SocialUser} from 'angularx-social-login';
import {map} from 'rxjs/operators';

@Injectable()
export class FacebookLoginService extends AbstractLoginService {
  userString: string;

  constructor(notificationService: NotificationService, private authService: AuthService) {
    super(notificationService);
  }

  protected delegatedLogin(authObs: Observable<User>): Observable<User> {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    return this.authService.authState.pipe(
      map((user: SocialUser) => {
        return new FacebookUser(user.firstName + ' ' + user.lastName, user.email, user.photoUrl, user.name, user.id, '');
      })
    );
    //let popup = this.notificationService.createLoadingPopup('app.checking-login');
    //self.facebook.login([ 'email' ]).then((response) => {
    //  const facebookCredential = firebase.auth.FacebookAuthProvider
    //    .credential(response.authResponse.accessToken);
    //
    //  firebase.auth().signInWithCredential(facebookCredential)
    //    .then((success) => {
    //      let user: User = new FacebookUser(success.user, success.email, success.photoURL,
    //                                        success.displayName, success.uid, success.phoneNumber);
    //      self.success(user);
    //      popup.dismiss();
    //    })
    //    .catch(error => {
    //      popup.dismiss();
    //      self.logout();
    //      self.notificationService.failed('l\'authentification a échoué (Promise.catch)', error);
    //    });
    //}).catch(
    //  error => {
    //    popup.dismiss();
    //    self.logout();
    //    self.notificationService.failed('l\'authentification a échoué (catch)', error);
    //  }
    //);
    //
    //return authObs;
  }

  private delegatedSignout() {
    this.authService.signOut();
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

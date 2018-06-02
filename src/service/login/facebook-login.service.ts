/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../../model/user';
import {Observable} from 'rxjs';
import {NotificationService} from '../notification.service';
import {AuthService, FacebookLoginProvider, SocialUser} from 'angularx-social-login';
import {filter, flatMap, map, take} from 'rxjs/operators';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class FacebookLoginService extends AbstractLoginService {
  userString: string;

  constructor(notificationService: NotificationService, private authService: AuthService, firebaseAuth: AngularFireAuth) {
    super(notificationService, firebaseAuth);
  }

  protected delegatedLogin(): Observable<User> {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    return this.authService.authState.pipe(
      filter(u => u != null),
      take(1),
      flatMap((socialUser: SocialUser) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(socialUser.authToken);
        return firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential)
          .then((success) => {
            return socialUser;
          });
      }),
      map((socialUser: SocialUser) => {
        let user: User = new FacebookUser(socialUser.name, socialUser.email, socialUser.photoUrl,
          socialUser.firstName + ' ' + socialUser.lastName, socialUser.id, '');
        this.success(user);
        return user;
      })
    );
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

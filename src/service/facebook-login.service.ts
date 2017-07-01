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
    this.facebook.login([ 'email' ]).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          let user = new FacebookUser(success.user, success.email, success.photoURL);
          this.userString = JSON.stringify(user);
          this.success(user);
        })
        .catch(
          error => this.notificationService.failed('Firebase failure', error)
        );

    }).catch(
      error => this.notificationService.failed('l\'authentification a échoué', error)
    );

    return this.authentifiedObservable;
  }
}

export class FacebookUser implements User {
  user: string;
  email: string;
  photoURL: string;

  constructor(user: string, email: string, photoURL: string) {
    this.user = user;
    this.email = email;
    this.photoURL = photoURL;
  }

  getUser(): string {
    return this.user;
  }

  getEmail(): string {
    return this.email;
  }

  getPhotoURL(): string {
    return this.photoURL;
  }
}

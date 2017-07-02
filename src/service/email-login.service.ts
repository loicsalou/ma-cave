/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../model/user';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from './notification.service';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class EmailLoginService extends AbstractLoginService {

  private _username: string;
  private _psw: string;

  private firebaseRef: firebase.database.Reference;

  constructor(notificationService: NotificationService,
              private firebase: AngularFireDatabase) {
    super(notificationService);
    this.firebaseRef = this.firebase.database.ref('users/');
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get psw(): string {
    return this._psw;
  }

  set psw(value: string) {
    this._psw = value;
  }

  public login(): Observable<User> {
    let self = this;
    firebase.auth().signInWithEmailAndPassword(this.username, this.psw)
      .then(
        token => {
          let displayName = token[ 'displayName' ];
          let email = token[ 'email' ];
          self.success(new EmailLoginUser(this.username, email, displayName, null));
        }
      )
      .catch(function (error) {
        firebase.auth().createUserWithEmailAndPassword(self.username, self.psw)
          .then(() => self.success(self.user))
          .catch(function (error2) {
            self.notificationService.failed('la création du compte utilisateur a échoué', error2)
          });
        self.notificationService.error('L\'authentification a échoué', error);
      });

    return this.authentifiedObservable;
  }
}

export class EmailLoginUser extends User {

  constructor(user: string, email: string, displayName: string, photoUrl: string) {
    super();
    this.user = user.replace(/[\.]/g, '');
    this.user = this.user.replace(/[#.]/g, '');
    this.email = email;
    this.photoURL = undefined;
    this.displayName = displayName ? displayName : email.split('@')[ 0 ];
    this.uid = undefined;
    this.phoneNumber = undefined;
  }
}



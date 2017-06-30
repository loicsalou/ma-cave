/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle} from './bottle';
import {FilterSet} from '../distribution/distribution';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../model/user';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from './notification.service';
import Reference = firebase.database.Reference;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class AnonymousLoginService extends AbstractLoginService {

  anoUser: User;

  constructor(notificationService: NotificationService, private firebaseAuth: AngularFireAuth) {
    super(notificationService);
  }

  public login(): Observable<User> {
    this.firebaseAuth.auth.signInAnonymously()
      .then(
        () => {
          this.anoUser = new AnonymousUser();
          this.success(this.anoUser);
        }
      )

    return this.authentifiedObservable;
  }
}

export class AnonymousUser implements User {
  private user: string;
  private email: string;
  private photoURL: string;

  constructor() {
    this.user = 'caveexplorer@gmailcom';
    this.email = 'cave.explorer@gmail.com';
    this.photoURL = null;
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


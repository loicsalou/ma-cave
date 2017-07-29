/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
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
export class AnonymousLoginService extends AbstractLoginService {

  anoUser: User;

  constructor(notificationService: NotificationService, private firebaseAuth: AngularFireAuth) {
    super(notificationService);
  }

  public login(): Observable<User> {
    let loadingPopup = this.notificationService.createLoadingPopup('app.checking-login');
    this.firebaseAuth.auth.signInAnonymously()
      .then(
        () => {
          loadingPopup.dismiss();
          this.anoUser = new AnonymousUser();
          this.success(this.anoUser);
        },
        err => {
          loadingPopup.dismiss();
          this.loginFailed();
          this.notificationService.error('Problème réseau', 'Impossible de s\'authentifier')
        }
      );

    return this.authentifiedObservable;
  }
}

export class AnonymousUser extends User {

  constructor() {
    super();
    this.user = 'caveexplorer@gmailcom';
    this.email = 'cave.explorer@gmail.com';
    this.photoURL = 'assets/icon/anonymous2.jpg';
    this.uid = undefined;
    this.phoneNumber = '00-12-00-34-99';
    this.displayName = 'Ano Nymous';
  }

}


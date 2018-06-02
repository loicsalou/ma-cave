/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../../model/user';
import {from, Observable} from 'rxjs';
import {NotificationService} from '../notification.service';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class AnonymousLoginService extends AbstractLoginService {

  anoUser: User;

  constructor(notificationService: NotificationService, firebaseAuth: AngularFireAuth) {
    super(notificationService, firebaseAuth);
  }

  protected delegatedLogin(): Observable<User> {
    let self = this;
    let popup = this.notificationService.createLoadingPopup('app.checking-login');
    return from(this.firebaseAuth.auth.signInAnonymously()
                  .then(
                    () => {
                      popup.dismiss();
                      self.anoUser = new AnonymousUser();
                      self.success(this.anoUser);
                      return this.anoUser;
                    },
                    err => {
                      popup.dismiss();
                      self.logout();
                      self.notificationService.error('Problème réseau', 'Impossible de s\'authentifier');
                      return undefined;
                    }
                  ));
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
    this.loginType = 'anonymous';
  }

}


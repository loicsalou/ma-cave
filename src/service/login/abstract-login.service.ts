import {Observable} from 'rxjs';
import {User} from '../../model/user';
import {NotificationService} from '../notification.service';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {traced} from '../../utils/decorators';

/**
 * Created by loicsalou on 13.06.17.
 */
export abstract class AbstractLoginService {
  protected notificationService: NotificationService;
  private _user: User;

  constructor(notificationService: NotificationService, protected firebaseAuth: AngularFireAuth) {
    this.notificationService = notificationService;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  /**
   * ne pas surcharger ! devrait être final mais pas possible en Typescript
   * @returns {Observable<User>}
   */
  public login(): Observable<User> {
    return this.delegatedLogin();
  }

  createAccount(user: any, pass: any) {
    this.notificationService.error('La création de ce type de compte n\'est pas activée');
  }

  @traced
  deleteAccount() {
    //"resetting-password": "Demande de réinitialisation en cours...",
    //  "deleting-account": "Suppression du compte en cours...",
    let self = this;
    let popup = this.notificationService.createLoadingPopup('app.deleting-account');
    var user = firebase.auth().currentUser;

    user.delete().then(function () {
      self.notificationService.information('app.deleting-account-succeeded');
      setTimeout(() => {
        popup.dismiss();
        self.logout();
      }, 100);
    }).catch(function (error) {
      popup.dismiss();
      self.notificationService.error('app.deleting-account-failed');
    });
  }

  resetPassword(user: string) {
    this.notificationService.error('La réinitialisation du mot de passe pour ce type de compte n\'est pas activée');
  }

  @traced
  public logout() {
    this.delegatedLogout();
    this.firebaseAuth.auth.signOut();
  }

  @traced
  public loginFailed() {
    this.notificationService.error('app.login-failed');
  }

  @traced
  public success(user: User) {
    if (user) {
      this.user = user;
    }
  }

  protected abstract delegatedLogin(): Observable<User>;

  protected delegatedLogout() {

  }
}

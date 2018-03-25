import {Observable} from 'rxjs/Observable';
import {User} from '../model/user';
import {NotificationService} from './notification.service';
import {Subject} from 'rxjs/Subject';
import * as firebase from 'firebase/app';

/**
 * Created by loicsalou on 13.06.17.
 */
export abstract class AbstractLoginService {
  protected notificationService: NotificationService;
  private authentified: Subject<User> = new Subject();
  private authentifiedObservable: Observable<User> = this.authentified.asObservable();

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  private _user: User;

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
    this.authentified = new Subject();
    this.authentifiedObservable = this.authentified.asObservable();
    return this.delegatedLogin(this.authentifiedObservable);
  }

  createAccount(user: any, pass: any) {
    this.notificationService.error('La création de ce type de compte n\'est pas activée')
  }

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
    this.notificationService.error('La réinitialisation du mot de passe pour ce type de compte n\'est pas activée')
  }

  public logout() {
    this.authentified.next(undefined);
  }

  public loginFailed() {
    this.notificationService.error('app.login-failed');
  }

  public success(user: User) {
    if (user) {
      this.user = user;
      this.authentified.next(user);
    }
  }

  protected abstract delegatedLogin(authObs: Observable<User>);
}

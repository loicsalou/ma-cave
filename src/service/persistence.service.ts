import {LoadingController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {LoginService} from './login.service';
import {NotificationService} from './notification.service';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../model/user';
import {Subscription} from 'rxjs/Subscription';
/**
 * Created by loicsalou on 16.06.17.
 */

export abstract class PersistenceService {

  protected USERS_FOLDER = 'users';
  protected XREF_FOLDER = 'xref';

  public XREF_ROOT: string;

  private loginSub: Subscription;

  constructor(private loadingCtrl: LoadingController, protected notificationService: NotificationService,
              protected loginService: LoginService, private translateService: TranslateService) {
    this.loginSub = loginService.authentifiedObservable.subscribe(
      user => this.handleLoginEvent(user)
    );
  }

  private handleLoginEvent(user: User) {
    if (user) {
      //clean subscriptions before init again
      this.cleanup();
      this.initialize(user);
    } else {
      this.cleanup();
    }
  }

  protected initialize(user: User) {
    this.XREF_ROOT = this.XREF_FOLDER;
  }

  protected cleanup() {
    this.XREF_ROOT = undefined;
  }

  protected handleError(message: string, error: any) {
    this.notificationService.error(message, error);
    return Observable.throw(error.json().error || 'Firebase error');
  }

}

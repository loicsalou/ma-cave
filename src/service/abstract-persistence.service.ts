import {Observable} from 'rxjs/Observable';
import {LoginService} from './login/login.service';
import {NotificationService} from './notification.service';
import {User} from '../model/user';
import {Subscription} from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';

/**
 * Created by loicsalou on 16.06.17.
 */

export abstract class AbstractPersistenceService {

  protected USERS_FOLDER = 'users';
  private loginSub: Subscription;

  constructor(protected notificationService: NotificationService, protected loginService: LoginService,
              protected translateService: TranslateService) {
    this.loginSub = this.loginService.authentifiedObservable.subscribe(
      user => this.handleLoginEvent(user)
    );
  }

  protected initialize(user: User) {
  }

  protected cleanup() {
  }

  protected handleError(message: string, error: any) {
    this.notificationService.error(message, error);
    return Observable.throw(error.json().error || 'Firebase error');
  }

  private handleLoginEvent(user: User) {
    if (user) {
      this.initialize(user);
    } else {
      this.cleanup();
    }
  }

}

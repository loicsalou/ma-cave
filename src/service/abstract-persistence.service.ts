
import {Subscription} from 'rxjs';

import {NotificationService} from './notification.service';
import {User} from '../model/user';
import {TranslateService} from '@ngx-translate/core';
import {OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../app/state/app.state';
import {SharedQuery} from '../app/state/shared.state';
import {Observable} from 'rxjs';
import {throwError} from 'rxjs/internal/observable/throwError';

/**
 * Created by loicsalou on 16.06.17.
 */

export abstract class AbstractPersistenceService implements OnDestroy {
  protected USERS_FOLDER = 'users';
  private loginSub: Subscription;

  constructor(protected notificationService: NotificationService,
              protected translateService: TranslateService,
              protected store: Store<ApplicationState>) {
  }

  ngOnDestroy(): void {
  }

  protected initialize(user: User) {
  }

  protected cleanup() {
  }

  protected handleError(message: string, error: any) {
    this.notificationService.error(message, error);
    return throwError(error.json().error || 'Firebase error');
  }

  protected subscribeLogin() {
    this.loginSub = this.store.select(SharedQuery.getSharedState)
      .subscribe(
        state => this.handleLoginEvent(state.user)
      );
  }

  private handleLoginEvent(user: User) {
    if (user) {
      this.initialize(user);
    } else {
      this.cleanup();
    }
  }
}

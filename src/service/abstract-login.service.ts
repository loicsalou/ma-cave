import {Observable} from 'rxjs/Observable';
import {User} from '../model/user';
import {NotificationService} from './notification.service';
import {Subject} from 'rxjs/Subject';

/**
 * Created by loicsalou on 13.06.17.
 */
export abstract class AbstractLoginService {
  private authentified: Subject<User> = new Subject();
  private authentifiedObservable: Observable<User> = this.authentified.asObservable();
  protected notificationService: NotificationService;

  private _user: User;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
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

  protected abstract delegatedLogin(authObs: Observable<User>);

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  public loginFailed() {
    this.authentified.next(undefined);
  }

  public success(user: User) {
    if (user) {
      this.user = user;
      this.authentified.next(user);
    }
  }
}

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {User} from '../model/user';
import {NotificationService} from './notification.service';
import {Subject} from 'rxjs/Subject';
/**
 * Created by loicsalou on 13.06.17.
 */

export abstract class AbstractLoginService {
  private authentified: Subject<User> = new Subject();
  public authentifiedObservable: Observable<User> = this.authentified.asObservable();
  protected notificationService: NotificationService;

  private _user: User;


  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  public abstract login();

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  public success(user: User) {
    if (user) {
      this._user = user;
      this.authentified.next(user);
    }
  }
}

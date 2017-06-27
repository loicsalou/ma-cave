import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {User} from '../model/user';
/**
 * Created by loicsalou on 13.06.17.
 */

export abstract class AbstractLoginService {
  private authentified: BehaviorSubject<User> = new BehaviorSubject(undefined);
  public authentifiedObservable: Observable<User> = this.authentified.asObservable();

  private _user: User;

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

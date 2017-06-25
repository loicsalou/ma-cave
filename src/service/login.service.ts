import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
/**
 * Created by loicsalou on 13.06.17.
 */

export abstract class LoginService {
  private authentified: BehaviorSubject<string> = new BehaviorSubject(undefined);
  public authentifiedObservable: Observable<string> = this.authentified.asObservable();

  private _user: string;
  private _psw: string;

  public abstract login();

  public getUser(): string {
    return this._user;
  }

  get user(): string {
    return this._user;
  }

  get psw(): string {
    return this._psw;
  }

  set user(value: string) {
    this._user = value;
  }

  set psw(value: string) {
    this._psw = value;
  }

  public success(user: string) {
    if (user) {
      this._user = user;
      this.authentified.next(user);
    }
  }

}

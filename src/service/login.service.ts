import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {User} from '../model/user';
import {AnonymousLoginService} from './anonymous-login.service';
import {EmailLoginService} from './email-login.service';
import {FacebookLoginService} from './facebook-login.service';
import {NotificationService} from './notification.service';
/**
 * Created by loicsalou on 13.06.17.
 */
export class LoginService {
  private authentified: BehaviorSubject<User> = new BehaviorSubject(undefined);
  public authentifiedObservable: Observable<User> = this.authentified.asObservable();

  private _user: User;

  constructor(private anoLogin: AnonymousLoginService, private mailLogin: EmailLoginService,
              private fbLogin: FacebookLoginService, private notificationService: NotificationService) {
  }

  public anonymousLogin() {
    this.anoLogin.login().subscribe((user: User) => this.initUser(user));
  }

  public emailLogin(login: string, psw: string) {
    this.mailLogin.username = login;
    this.mailLogin.psw = psw;
    this.mailLogin.login().subscribe(
      (user: User) => this.initUser(user),
      error => this.notificationService.failed('L\'authentification a échoué, veuillez vérifier votre saisie')
    );
  }

  public facebookLogin() {
    this.fbLogin.login().subscribe(
      (user: User) => this.initUser(user),
      error => this.notificationService.failed('L\'authentification Facebook a échoué, veuillez vérifier votre compte')
    );
  }

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

  private initUser(user: User) {
    this.user = user;
    this.authentified.next(user);
  }

  logout() {
    this.initUser(undefined);
  }
}

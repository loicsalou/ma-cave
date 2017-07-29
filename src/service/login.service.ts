import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {User} from '../model/user';
import {AnonymousLoginService} from './anonymous-login.service';
import {EmailLoginService} from './email-login.service';
import {FacebookLoginService} from './facebook-login.service';
import {NotificationService} from './notification.service';
import {Subscription} from 'rxjs/Subscription';
import {LocalLoginService} from './local-login.service';
import {NativeStorageService} from './native-storage.service';

/**
 * Created by loicsalou on 13.06.17.
 */
export class LoginService {
  private authentified: Subject<User> = new Subject();
  public authentifiedObservable: Observable<User> = this.authentified.asObservable();

  private _user: User;
  private loginSub: Subscription;

  constructor(private anoLogin: AnonymousLoginService, private mailLogin: EmailLoginService,
              private fbLogin: FacebookLoginService, private locLogin: LocalLoginService,
              private notificationService: NotificationService, private localStorage: NativeStorageService) {
  }

  public localLogin(user: User) {
    this.locLogin.localUser = user;
    this.loginSub = this.locLogin.login().subscribe(
      (user: User) => {
        this.initUser(user)
      },
      err => {
        this.notificationService.failed('L\'authentification a échoué, veuillez vérifier votre saisie');
      })
  }

  public anonymousLogin() {
    this.loginSub = this.anoLogin.login().subscribe(
      (user: User) => {
        this.initUser(user);
      },
      err => {
        this.notificationService.failed('L\'authentification a échoué, veuillez vérifier votre saisie');
      }
    )
  }

  public emailLogin(login: string, psw: string) {
    this.mailLogin.username = login;
    this.mailLogin.psw = psw;
    this.loginSub = this.mailLogin.login().subscribe(
      (user: User) => {
        this.initUser(user);
      },
      error => {
        this.notificationService.failed('L\'authentification a échoué, veuillez vérifier votre saisie');
      }
    );
  }

  public facebookLogin() {
    this.loginSub = this.fbLogin.login().subscribe(
      (user: User) => this.initUser(user),
      error => this.notificationService.failed('L\'authentification Facebook a échoué, veuillez vérifier votre' +
        ' compte')
    )
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  private initUser(user: User) {
    if (user) {
      this.user = user;
      this.localStorage.initialize(user);
      this.authentified.next(user);
    }
    else {
      this.logout();
    }
  }

  public logout() {
    this.loginSub.unsubscribe();
    this.loginSub = undefined;
    this.user = undefined;
    this.localStorage.cleanup();
    this.authentified.next(this.user);
  }
}

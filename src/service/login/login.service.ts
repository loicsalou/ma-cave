import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {User} from '../../model/user';
import {AnonymousLoginService} from './anonymous-login.service';
import {EmailLoginService} from './email-login.service';
import {FacebookLoginService} from './facebook-login.service';
import {NotificationService} from '../notification.service';
import {Subscription} from 'rxjs/Subscription';
import {LocalLoginService} from './local-login.service';
import {NativeStorageService} from '../native-storage.service';
import {AbstractLoginService} from './abstract-login.service';
import {GoogleLoginService} from './google-login.service';

/**
 * Created by loicsalou on 13.06.17.
 */
export class LoginService {
  private authentified: Subject<User> = new Subject();
  public authentifiedObservable: Observable<User> = this.authentified.asObservable();
  private loginSub: Subscription;
  private currentLoginService: AbstractLoginService;

  constructor(private anoLogin: AnonymousLoginService, private mailLogin: EmailLoginService,
              private fbLogin: FacebookLoginService, private locLogin: LocalLoginService, private gglLogin: GoogleLoginService,
              private notificationService: NotificationService, private localStorage: NativeStorageService) {
  }

  private _user: User;

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  createAccount(user: string, psw: string) {
    this.currentLoginService.createAccount(user, psw);
  }

  deleteAccount() {
    this.currentLoginService.deleteAccount();
  }

  resetEmailPassword(user: string) {
    this.currentLoginService = this.mailLogin;
    this.resetPassword(user);
  }

  resetPassword(user: string) {
    this.currentLoginService.resetPassword(user);
  }

  public localLogin(user: User) {
    this.currentLoginService = this.locLogin;
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
    this.currentLoginService = this.anoLogin;
    this.loginSub = this.anoLogin.login().subscribe(
      (user: User) => {
        this.initUser(user);
      },
      err => {
        this.notificationService.failed('L\'authentification a échoué, veuillez vérifier votre saisie');
      }
    )
  }

  public googleLogin() {
    this.currentLoginService = this.gglLogin;
    this.loginSub = this.gglLogin.login().subscribe(
      (user: User) => {
        this.initUser(user);
      },
      err => {
        this.notificationService.failed('L\'authentification a échoué, veuillez vérifier votre saisie');
      }
    )
  }

  public emailLogin(login: string, psw: string) {
    this.currentLoginService = this.mailLogin;
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
    this.currentLoginService = this.fbLogin;
    this.loginSub = this.fbLogin.login().subscribe(
      (user: User) => this.initUser(user),
      error => this.notificationService.failed('L\'authentification Facebook a échoué, veuillez vérifier votre' +
        ' compte')
    )
  }

  public logout() {
    this.loginSub.unsubscribe();
    this.loginSub = undefined;
    this.user = undefined;
    this.localStorage.cleanup();
    this.authentified.next(this.user);
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
}

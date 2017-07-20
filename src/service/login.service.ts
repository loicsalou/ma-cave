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
  private loadingPopup: any;

  constructor(private anoLogin: AnonymousLoginService, private mailLogin: EmailLoginService,
              private fbLogin: FacebookLoginService, private locLogin: LocalLoginService,
              private notificationService: NotificationService, private localStorage: NativeStorageService) {
  }

  public localLogin(user: User) {
    this.loadingPopup = this.notificationService.createLoadingPopup('app.checking-login');
    this.locLogin.localUser = user;
    this.loginSub = this.locLogin.login().subscribe((user: User) => this.initUser(user));
  }

  public anonymousLogin() {
    this.loadingPopup = this.notificationService.createLoadingPopup('app.checking-login');
    this.loginSub = this.anoLogin.login().subscribe((user: User) => this.initUser(user));
  }

  public emailLogin(login: string, psw: string) {
    this.loadingPopup = this.notificationService.createLoadingPopup('app.checking-login');
    this.mailLogin.username = login;
    this.mailLogin.psw = psw;
    this.loginSub = this.mailLogin.login().subscribe(
      (user: User) => this.initUser(user),
      error => this.notificationService.failed('L\'authentification a échoué, veuillez vérifier votre saisie')
    );
  }

  public facebookLogin() {
    this.loadingPopup = this.notificationService.createLoadingPopup('app.checking-login');
    this.loginSub = this.fbLogin.login().subscribe(
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

  private initUser(user: User) {
    if (this.loadingPopup) {
      this.loadingPopup.dismiss();
    }
    this.user = user;
    this.localStorage.initialize(user);
    this.authentified.next(user);
  }

  logout() {
    this.loginSub.unsubscribe();
    this.loginSub = undefined;
    this.user = undefined;
    this.localStorage.cleanup();
    this.authentified.next(this.user);
  }
}

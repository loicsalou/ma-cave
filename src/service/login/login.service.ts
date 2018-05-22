import {Observable, Subject, Subscription} from 'rxjs';
import {User} from '../../model/user';
import {AnonymousLoginService} from './anonymous-login.service';
import {EmailLoginService} from './email-login.service';
import {FacebookLoginService} from './facebook-login.service';
import {AbstractLoginService} from './abstract-login.service';
import {GoogleLoginService} from './google-login.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../app/state/app.state';
import {LoginSuccessAction, LogoutAction} from '../../app/state/shared.actions';
import {TranslateService} from '@ngx-translate/core';
import {AlertController} from 'ionic-angular';

/**
 * Created by loicsalou on 13.06.17.
 */
export class LoginService {
  private authentified: Subject<User> = new Subject();
  public authentifiedObservable: Observable<User> = this.authentified.asObservable();
  private loginSub: Subscription;
  private currentLoginService: AbstractLoginService;
  private _user: User;

  constructor(private anoLogin: AnonymousLoginService,
              private mailLogin: EmailLoginService,
              private fbLogin: FacebookLoginService,
              private gglLogin: GoogleLoginService,
              private translateService: TranslateService,
              private alertController: AlertController,
              private store: Store<ApplicationState>) {
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  createAccount(user: string, psw: string) {
    this.currentLoginService = this.mailLogin;
    this.currentLoginService.createAccount(user, psw);
  }

  deleteAccount() {
    this.currentLoginService.deleteAccount();
  }

  resetEmailPassword(user: string) {
    this.currentLoginService = this.mailLogin;
    this.currentLoginService.resetPassword(user);
  }

  public anonymousLogin() {
    this.currentLoginService = this.anoLogin;
    this.loginSub = this.anoLogin.login().subscribe(
      (user: User) => {
        this.initUser(user);
      },
      err => {
        this.failed('L\'authentification a échoué, veuillez vérifier votre saisie ' + err);
      }
    );
  }

  public googleLogin() {
    this.currentLoginService = this.gglLogin;
    this.loginSub = this.gglLogin.login().subscribe(
      (user: User) => {
        this.initUser(user);
      },
      err => {
        this.failed('L\'authentification a échoué, veuillez vérifier votre saisie ' + err);
      }
    );
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
        this.failed('L\'authentification a échoué, veuillez vérifier votre saisie ' + error);
      }
    );
  }

  public facebookLogin() {
    this.currentLoginService = this.fbLogin;
    this.loginSub = this.fbLogin.login().subscribe(
      (user: User) => this.initUser(user),
      error =>
        this.failed('L\'authentification Facebook a échoué, veuillez vérifier votre compte ' + error)
    );
  }

  public logout() {
    this.loginSub.unsubscribe();
    this.store.dispatch(new LogoutAction());
    this.loginSub = undefined;
    this.user = undefined;
    this.authentified.next(this.user);
  }

  private initUser(user: User) {
    if (user) {
      this.store.dispatch(new LoginSuccessAction(user));
      this.user = user;
      this.authentified.next(user);
    }
    else {
      this.logout();
    }
  }

  private failed(message: string, error?: any) {
    let msg = this.translateService.instant(message);
    this.alertController.create({
                                  title: this.translateService.instant('app.failed'),
                                  subTitle: msg + (error ? error : ''),
                                  buttons: [ 'Ok' ]
                                })
      .present();
  }

}

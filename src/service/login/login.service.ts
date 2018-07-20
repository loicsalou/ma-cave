import {Subscription} from 'rxjs';
import {User} from '../../model/user';
import {AnonymousLoginService} from './anonymous-login.service';
import {AbstractLoginService} from './abstract-login.service';
import {TranslateService} from '@ngx-translate/core';
import {AlertController} from 'ionic-angular';
import {OnDestroy} from '@angular/core';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs';
import {traced} from '../../utils/decorators';

export type LOGINTYPE = 'FIREBASE' | 'ANONYMOUS';

/**
 * Created by loicsalou on 13.06.17.
 */
export class LoginService implements OnDestroy {
  private loginSub: Subscription;
  private currentLoginService: AbstractLoginService;
  private _user: User;

  constructor(private anoLogin: AnonymousLoginService,
              private translateService: TranslateService,
              private alertController: AlertController) {
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  @traced
  anonymousLogin(): Observable<User> {
    this.currentLoginService = this.anoLogin;
    return this.anoLogin.login();
  }

  @traced
  login(type: LOGINTYPE, user?: string, password?: string): Observable<User> {
    switch (type) {
      case 'ANONYMOUS':
        return this.anonymousLogin();

      default:
        throw new Error('Type de login non supporté');
    }
  }

  @traced
  logout() {
    firebase.auth().signOut();
  }

  @traced
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

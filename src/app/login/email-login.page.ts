import {Component} from '@angular/core';
import {LoginService} from '../../service/login/login.service';
import {User} from '../../model/user';
import {ApplicationState} from '../state/app.state';
import {Store} from '@ngrx/store';
import {LoginAction} from '../state/shared.actions';
import {tap} from 'rxjs/operators';

@Component({
             selector: 'login-page',
             templateUrl: 'email-login.page.html'
           })

export class EmailLoginPage {

  user: string;
  psw: string;

  constructor(private loginService: LoginService, private store: Store<ApplicationState>) {
  }

  public signin() {
    this.store.dispatch(new LoginAction('EMAIL', this.user, this.psw));
  }

  createAccount() {
    this.loginService.createAccount(this.user, this.psw);
  }

  resetPassword() {
    this.loginService.resetEmailPassword(this.user);
  }

  keyup(event) {
    if (event.keyCode == 13) {
      this.signin();
    }
  }
}

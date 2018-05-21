import {Component} from '@angular/core';
import {LoginService} from '../../service/login/login.service';

@Component({
             selector: 'login-page',
             templateUrl: 'email-login.page.html'
           })

export class EmailLoginPage {

  user: string;
  psw: string;

  constructor(private loginService: LoginService) {
  }

  public signin() {
    this.loginService.emailLogin(this.user, this.psw);
  }

  createAccount() {
    this.loginService.createAccount(this.user, this.psw);
  }

  resetPassword() {
    this.loginService.resetEmailPassword(this.user);
  }

  keyup(event) {
    if (event.keyCode == 13) {
      this.signin()
    }
  }
}

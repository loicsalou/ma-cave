import {Component} from '@angular/core';
import {LoginService} from '../../../service/login.service';
import {NotificationService} from '../../../service/notification.service';

@Component({
             selector: 'login-page',
             templateUrl: 'email-login.page.html'
           })

export class EmailLoginPage {

  user: string;
  psw: string;

  constructor(private loginService: LoginService, private notificationService: NotificationService) {
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

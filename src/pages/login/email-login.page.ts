import {Component} from '@angular/core';
import {LoginPage} from './login-page';
import {LoginService} from '../../service/login.service';
import {NotificationService} from '../../service/notification.service';

@Component({
             selector: 'login-page',
             templateUrl: 'email-login.page.html'
           })

export class EmailLoginPage extends LoginPage {

  constructor(loginService: LoginService, notificationService: NotificationService) {
    super(loginService, notificationService);
  }

  public signin() {
    this.loginService.emailLogin(this.user, this.psw);
  }

  keyup(event) {
    if (event.keyCode == 13) {
      this.signin()
    }
  }
}

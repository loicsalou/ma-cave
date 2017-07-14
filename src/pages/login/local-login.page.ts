import {Component} from '@angular/core';
import {LoginPage} from './login-page';
import {LoginService} from '../../service/login.service';
import {NotificationService} from '../../service/notification.service';
import {User} from '../../model/user';

@Component({
             selector: 'login-page',
             templateUrl: 'local-login.page.html'
           })

export class LocalLoginPage extends LoginPage {

  chosenUser: User;

  constructor(loginService: LoginService, notificationService: NotificationService) {
    super(loginService, notificationService);
  }

  public loginAs(user: User) {
    this.chosenUser=user;
    this.signin();
  }

  public signin() {
    this.loginService.emailLogin(this.user, this.psw);
  }
}

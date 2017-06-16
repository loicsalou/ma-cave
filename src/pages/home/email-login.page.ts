import {Component, Input, OnInit} from '@angular/core';
import {LoginPage} from './login-page';
import {LoginService} from './login.service';
import {AlertController} from 'ionic-angular';

@Component({
             selector: 'login-page',
             templateUrl: 'email-login.page.html'
           })

export class EmailLoginPage extends LoginPage implements OnInit {

  constructor(loginService: LoginService, alertController: AlertController) {
    super(loginService, alertController);
  }

  ngOnInit() {
  }

  public signin() {
    this.loginService.user = this.user;
    this.loginService.psw = this.psw;
    this.loginService.login();
  }

  authenticated(user: any) {
    this.loginService.authentified.unsubscribe();
  }

}

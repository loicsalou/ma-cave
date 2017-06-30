import {Component, Input, OnInit} from '@angular/core';
import {LoginPage} from './login-page';
import {LoginService} from '../../service/login.service';
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
    this.loginService.emailLogin(this.user, this.psw);
  }

  keyup(event) {
    if (event.keyCode==13) {
      this.signin()
    }
  }
}

import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LoginService} from '../../service/login.service';
import {HomePage} from '../home/home';

@Component({
             selector: 'page-profile',
             templateUrl: './profile.html'
           })
export class ProfilePage implements OnInit {
  version: any;

  constructor(public loginService: LoginService, private navCtrl: NavController) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
  }

  filterOnText(event: any) {
  }

  logout() {
    this.loginService.logout();
    this.navCtrl.push(HomePage);
  }
}

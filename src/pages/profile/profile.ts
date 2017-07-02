import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LoginService} from '../../service/login.service';
import {HomePage} from '../home/home';
import {User} from '../../model/user';
import Platform = NodeJS.Platform;

@Component({
             selector: 'page-profile',
             templateUrl: './profile.html',
             styleUrls: ['/profile.scss']
           })
export class ProfilePage implements OnInit {
  version: any;
  userData: any;
  private userDataKeys: string[];
  private userDataValues: any[];

  constructor(public loginService: LoginService, private navCtrl: NavController) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
    this.userDataKeys = Object.keys(this.loginService.user);
    this.userDataValues = [];
    this.userDataKeys.forEach(key => {
      this.userDataValues.push(this.loginService.user[ key ])
    });
  }

  get user(): User {
    return this.loginService.user;
  }

  properties() {
    return this.loginService[ 'userrString' ];
  }

  filterOnText(event: any) {
  }

  data(): string[] {
    return this.userData;
  }

  logout() {
    this.loginService.logout();
  }
}

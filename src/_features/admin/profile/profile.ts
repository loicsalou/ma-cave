import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../../service/login/login.service';
import {User} from '../../../model/user';
import {NotificationService} from '../../../service/notification.service';

@Component({
             selector: 'page-profile',
             templateUrl: './profile.html'
           })
export class ProfilePage implements OnInit {
  version: any;
  userData: any;
  private userDataKeys: string[];
  private userDataValues: any[];

  constructor(public loginService: LoginService, private notificationService: NotificationService) {
  }

  get user(): User {
    return this.loginService.user;
  }

  ngOnInit(): void {
    this.version = require('../../../../package.json').version;
    this.userDataKeys = Object.keys(this.loginService.user);
    this.userDataValues = [];
    this.userDataKeys.forEach(key => {
      this.userDataValues.push(this.loginService.user[ key ])
    });
    this.notificationService.debugAlert('photo user=' + JSON.stringify(this.loginService.user));
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

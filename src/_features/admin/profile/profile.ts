import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from '../../../service/login/login.service';
import {User} from '../../../model/user';
import {NotificationService} from '../../../service/notification.service';
import {SettingsService} from '../../../service/settings.service';
import {Subscription} from 'rxjs/Subscription';
import VERSION from '../version';

@Component({
             selector: 'page-profile',
             templateUrl: './profile.html'
           })
export class ProfilePage implements OnInit, OnDestroy {
  version: any;
  userData: any;
  _currentTheme: string;
  private userDataKeys: string[];
  private userDataValues: any[];
  private sub: Subscription;

  constructor(public loginService: LoginService, private notificationService: NotificationService,
              private settings: SettingsService) {
    this.sub = this.settings.activeTheme.subscribe(
      th => this._currentTheme = th
    );
  }

  get themes(): { name: string, class: string }[] {
    return this.settings.getAvailableThemes();
  }

  get currentTheme(): string {
    return this._currentTheme;
  }

  set currentTheme(value: string) {
    this.settings.setActiveTheme(value);
  }

  get user(): User {
    return this.loginService.user;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    //this.version = require('../../../../package.json').version;
    this.version = VERSION;
    this.userDataKeys = Object.keys(this.loginService.user);
    this.userDataValues = [];
    this.userDataKeys.forEach(key => {
      this.userDataValues.push(this.loginService.user[ key ]);
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

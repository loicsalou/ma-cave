import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from '../../../service/login/login.service';
import {User} from '../../../model/user';
import {NotificationService} from '../../../service/notification.service';
import VERSION from '../version';
import {SharedPersistenceService} from '../../../service/shared-persistence.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../../app/state/app.state';
import {LogoutAction, UpdateThemeAction} from '../../../app/state/shared.actions';
import {SharedQuery} from '../../../app/state/shared.state';
import {Subscription} from 'rxjs/Subscription';

@Component({
             selector: 'page-profile',
             templateUrl: './profile.html'
           })
export class ProfilePage implements OnInit, OnDestroy {
  version: any;
  userData: any;
  _currentTheme: string;
  prefsSub: Subscription;
  private userDataKeys: string[];
  private userDataValues: any[];

  constructor(public loginService: LoginService, private notificationService: NotificationService,
              private sharedServices: SharedPersistenceService, @Inject('GLOBAL_CONFIG') private config,
              private store: Store<ApplicationState>) {
    this.prefsSub = store.select(SharedQuery.getSharedState).subscribe(
      prefs => this._currentTheme = prefs.theme
    );
  }

  get themes(): { name: string, class: string }[] {
    return this.config.settings.themes;
  }

  get currentTheme(): string {
    return this._currentTheme;
  }

  set currentTheme(value: string) {
    this._currentTheme = value;
    this.store.dispatch(new UpdateThemeAction(value));
  }

  get user(): User {
    return this.loginService.user;
  }

  ngOnInit(): void {
    this.version = VERSION;
    this.userDataKeys = Object.keys(this.loginService.user);
    this.userDataValues = [];
    this.userDataKeys.forEach(key => {
      this.userDataValues.push(this.loginService.user[ key ]);
    });
    this.notificationService.debugAlert('photo user=' + JSON.stringify(this.loginService.user));
  }

  ngOnDestroy(): void {
    this.prefsSub.unsubscribe();
  }

  filterOnText(event: any) {
  }

  data(): string[] {
    return this.userData;
  }

  logout() {
    this.store.dispatch(new LogoutAction());
  }
}

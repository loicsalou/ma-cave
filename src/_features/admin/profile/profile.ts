import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../../model/user';
import {NotificationService} from '../../../service/notification.service';
import VERSION from '../version';
import {SharedPersistenceService} from '../../../service/shared-persistence.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../../app/state/app.state';
import {LogoutAction, UpdateThemeAction} from '../../../app/state/shared.actions';
import {SharedQuery} from '../../../app/state/shared.state';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {filter, tap} from 'rxjs/operators';

@Component({
             selector: 'page-profile',
             templateUrl: './profile.html'
           })
export class ProfilePage implements OnInit, OnDestroy {
  version: any;
  userData: any;
  _currentTheme: string;
  prefsSub: Subscription;
  user$: Observable<User>;

  private userDataKeys: string[];
  private userDataValues: any[];

  constructor(private notificationService: NotificationService,
              private sharedServices: SharedPersistenceService, @Inject('GLOBAL_CONFIG') private config,
              private store: Store<ApplicationState>) {
    this.prefsSub = store.select(SharedQuery.getSharedState).subscribe(
      prefs => this._currentTheme = prefs.theme
    );
  }

  get themes(): Theme[] {
    return this.config.settings.themes;
  }

  get currentTheme(): string {
    return this._currentTheme;
  }

  set currentTheme(theme: string) {
    this._currentTheme = theme;
    this.updateProfile();
  }

  ngOnInit(): void {
    this.version = VERSION;
    this.user$ = this.store.select(SharedQuery.getLoginUser).pipe(
      filter(user => user!==undefined),
      tap(user => {
        this.userDataKeys = Object.keys(user);
        this.userDataValues = [];
        this.userDataKeys.forEach(key => {
          this.userDataValues.push(user[ key ]);
        });
        this.notificationService.debugAlert('photo user=' + JSON.stringify(user));
      })
    );
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

  private updateProfile() {
    this.store.dispatch(new UpdateThemeAction(this.currentTheme));
  }
}

interface Theme {
  name: string;
  class: string;
}

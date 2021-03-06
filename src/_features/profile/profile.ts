import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../model/user';
import {NotificationService} from '../../service/notification.service';
import * as VERSION from '../../app/version';
import {SharedPersistenceService} from '../../service/shared-persistence.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../app/state/app.state';
import {LogoutAction, UpdatePrefsAction} from '../../app/state/shared.actions';
import {BOTTLE_ITEM_TYPE, SharedQuery} from '../../app/state/shared.state';
import {Observable, Subscription} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {IonicPage, NavController} from 'ionic-angular';
import {HomePage} from '../../app/home/home';

@IonicPage()
@Component({
             selector: 'page-profile',
             templateUrl: './profile.html'
           })
export class ProfilePage implements OnInit, OnDestroy {
  version: any;
  userData: any;
  _currentTheme: string;
  private _currentItemType: BOTTLE_ITEM_TYPE;
  prefsSub: Subscription;
  user$: Observable<User>;

  private userDataKeys: string[];
  private userDataValues: any[];

  constructor(private notificationService: NotificationService,
              private sharedServices: SharedPersistenceService, @Inject('GLOBAL_CONFIG') private config,
              private store: Store<ApplicationState>, private navCtrl: NavController) {
    this.prefsSub = store.select(SharedQuery.getSharedState).subscribe(
      prefs => {
        this._currentTheme = prefs.theme;
        this._currentItemType = prefs.bottleItemType;
      }
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

  get currentItemType(): BOTTLE_ITEM_TYPE {
    return this._currentItemType;
  }

  set currentItemType(value: BOTTLE_ITEM_TYPE) {
    this._currentItemType = value;
    this.updateProfile();
  }

  ngOnInit(): void {
    this.version = VERSION;
    this.user$ = this.store.select(SharedQuery.getLoginUser).pipe(
      filter(user => user !== undefined),
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
    //this.navCtrl.setRoot(HomePage);
    //this.navCtrl.popToRoot();
    //setTimeout(() => {
    //             window.history.pushState({}, '', '/');
    //             //window.location.reload();
    //           }
    //  , 100);
  }

  private updateProfile() {
    this.store.dispatch(new UpdatePrefsAction(this.currentTheme, this.currentItemType));
  }
}

interface Theme {
  name: string;
  class: string;
}

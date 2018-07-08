import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {FirebaseUser} from '../../model/user';
import {TabsPage} from '../tabs/tabs';
import {Observable} from 'rxjs';
import {NotificationService} from '../../service/notification.service';
import {VERSION} from '../version';
import {ApplicationState} from '../state/app.state';
import {Store} from '@ngrx/store';
import {LoadBottlesAction} from '../state/bottles.actions';
import {SharedQuery} from '../state/shared.state';
import {filter, map, take, tap} from 'rxjs/operators';
import {isMobileDevice, logInfo} from '../../utils';
import {traced} from '../../utils/decorators';
import {Subscription} from 'rxjs/Subscription';
import {AngularFireAuth} from 'angularfire2/auth';
import {LoginSuccessAction} from '../state/shared.actions';
import * as firebase from 'firebase';
import {LoginService} from '../../service/login/login.service';
import {AnonymousUser} from '../../service/login/anonymous-login.service';

@Component({
             selector: 'page-home',
             templateUrl: 'home.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class HomePage implements OnInit {
  public static loggedIn = false;
  version: any;
  currentTheme$: Observable<string>;

  private isMobile: boolean = false;
  private loginSub: Subscription;

  constructor(public navCtrl: NavController,
              private notificationService: NotificationService,
              private platform: Platform,
              private store: Store<ApplicationState>,
              private loginService: LoginService,
              private angularFireAuth: AngularFireAuth) {
    this.install();
    this.store.select(SharedQuery.getLoginUser).pipe(
      filter(user => user != null),
      take(1)
    ).subscribe(
      user => {
        this.navigateToDashboard();
      }
    );
  }

  install() {
    window[ 'isUpdateAvailable' ]
      .then(isAvailable => {
        if (isAvailable) {
          this.notificationService.ask('Mise à jour',
                                       'Une mise à jour est disponible ! installer maintenant ?')
            .pipe(
              take(1),
              tap(accepted => {
                if (accepted) {
                  setTimeout(() => {
                               window.history.pushState({}, '', '/');
                               window.location.reload();
                             }
                    , 100);
                }
              })
            );
        }
      });
  }

  ngOnInit(): void {
    this.version = VERSION;
    this.isMobile = isMobileDevice();
    this.currentTheme$ = this.store.select(SharedQuery.getSharedState).pipe(
      map(state =>
            state.theme ? state.theme : 'cavus-theme')
    );
    this.loginSub = this.angularFireAuth.authState.subscribe((firebaseUser: firebase.User) => {
      if (firebaseUser) {
        if (firebaseUser.email != null) {
          const user = new FirebaseUser(firebaseUser);
          this.store.dispatch(new LoginSuccessAction(user));
        } else {
          const user = new AnonymousUser();
          this.store.dispatch(new LoginSuccessAction(user));
        }
      } else {
        console.log('Logged out :(');
      }
    });
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
  }

  successCallback(event: firebase.User): boolean {
    logInfo('login success ' + event);
    return true;
  }

  loginAnonymous() {
    this.loginService.anonymousLogin();
  }

  @traced
  private navigateToDashboard() {
    HomePage.loggedIn = true;
    this.store.dispatch(new LoadBottlesAction());
    this.navCtrl.setRoot(TabsPage);
  }
}

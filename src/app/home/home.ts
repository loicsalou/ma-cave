import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Modal, ModalController, NavController, Platform} from 'ionic-angular';
import {EmailLoginPage} from '../login/email-login.page';
import {User} from '../../model/user';
import {TabsPage} from '../tabs/tabs';
import {Observable, of} from 'rxjs';
import {NotificationService} from '../../service/notification.service';
import {VERSION} from '../version';
import {ApplicationState} from '../state/app.state';
import {Store} from '@ngrx/store';
import {LoadBottlesAction} from '../state/bottles.actions';
import {SharedQuery} from '../state/shared.state';
import {catchError, filter, map, take, tap} from 'rxjs/operators';
import {isMobileDevice, logInfo} from '../../utils';
import {LoginAction} from '../state/shared.actions';
import {traced} from '../../utils/decorators';
import {Subscription} from 'rxjs/Subscription';
import * as firebase from 'firebase';

@Component({
             selector: 'page-home',
             templateUrl: 'home.html',
             changeDetection: ChangeDetectionStrategy.OnPush
             // styleUrls:[ 'home.scss' ]
           })
export class HomePage implements OnInit {
  public static loggedIn = false;
  version: any;
  currentTheme$: Observable<string>;
  showUpdate = false;

  private loginPage: Modal;
  private isMobile: boolean = false;
  private deferredPrompt;
  private loginSub: Subscription;

  constructor(public navCtrl: NavController,
              private modalController: ModalController,
              private notificationService: NotificationService,
              private platform: Platform,
              private store: Store<ApplicationState>) {
    this.initSwHandling();
  }

  initSwHandling() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      // Update UI notify the user they can add to home screen
      this.showUpdate = true;
    });
  }

  install() {
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          logInfo('User accepted the A2HS prompt');
        } else {
          logInfo('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

  ngOnInit(): void {
    this.version = VERSION;
    this.isMobile = isMobileDevice();
    this.currentTheme$ = this.store.select(SharedQuery.getSharedState).pipe(
      map(state =>
            state.theme ? state.theme : 'cavus-theme')
    );
  }

  @traced
  facebookLogin() {
    this.store.dispatch(new LoginAction('FACEBOOK'));
    this.waitForLogin();
  }

  @traced
  emailLogin() {
    this.loginPage = this.modalController.create(EmailLoginPage);
    // la page dispatche l'action de login
    this.loginPage.present();
    this.waitForLogin();
  }

  @traced
  googleLogin() {
    this.store.dispatch(new LoginAction('GOOGLE'));
    this.waitForLogin();
  }

  @traced
  anonymousLogin() {
    this.store.dispatch(new LoginAction('ANONYMOUS'));
    this.waitForLogin();
  }

  @traced
  private handleLoginEvent(user: User) {
    if (user !== undefined) {
          HomePage.loggedIn = true;
          this.store.dispatch(new LoadBottlesAction());
          this.navCtrl.setRoot(TabsPage);
    }
  }

  @traced
  private waitForLogin() {
    this.store.select(SharedQuery.getLoginUser).pipe(
      filter(user => user !== undefined),
      tap(() => {
        if (this.loginPage) {
          this.loginPage.dismiss();
        }
      }),
      take(1)
    ).subscribe(
      (user: User) => this.handleLoginEvent(user)
    );
  }

  private handleError(err) {
    this.notificationService.error(err);
    this.loginSub.unsubscribe();
  }
}

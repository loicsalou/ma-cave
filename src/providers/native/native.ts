import {Injectable} from '@angular/core';

import {NavController, Platform} from 'ionic-angular';
import {Subscription} from 'rxjs';
import {NotificationService} from '../../service/notification.service';

/*
  Generated class for the NativeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class NativeProvider {
  private disconnectSubscription: Subscription;
  private connectSubscription: Subscription;

  constructor(public platform: Platform,
              private notificationService: NotificationService) {
    //this.checkPermissions();
    this.initNetworkWatching();
  }

  checkPermissions() {
  }

  /**
   * User lohgged out ==> unsubscribe from observables
   */
  public logout() {
    // stop disconnect watch
    this.disconnectSubscription.unsubscribe();
    // stop connect watch
    this.connectSubscription.unsubscribe();
  }

  public initNativeFeatures(navCtrl: NavController) {
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        if (navCtrl.canGoBack()) {
          navCtrl.pop();
        } else {
          this.notificationService.ask('app.exit-title', 'app.exit-message').subscribe(
            response => {
              if (response) {
                this.platform.exitApp();
              }
            }
          );
        }
      });
    });
  }

  public feedBack() {
  }

  private initNetworkWatching() {
  }
}

import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {NavController, Platform} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {DeviceFeedback} from '@ionic-native/device-feedback';
import {Network} from '@ionic-native/network';
import {Subscription} from 'rxjs/Subscription';
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

  constructor(public platform: Platform, private splashScreen: SplashScreen, private deviceFeedBack: DeviceFeedback,
              private androidPermissions: AndroidPermissions, private network: Network,
              private notificationService: NotificationService) {
    this.checkPermissions();
    this.initNetworkWatching();
  }

  checkPermissions() {
    if (this.platform.is('cordova')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        success => {
        },
        err => {
          this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.CAMERA);
        }
      );

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        success => {
        },
        err => {
          this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
        }
      );

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_NETWORK_STATE).then(
        success => {
        },
        err => {
          this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.ACCESS_NETWORK_STATE);
        }
      );
    }
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

  private initNetworkWatching() {
// watch network for a disconnect
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      //this.notificationService.information('Réseau absent...');
    });

// watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      //this.notificationService.information('Reconnexion au réseau');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          //this.notificationService.information('Connexion wifi trouvée');
        }
      }, 3000);
    });
  }

  public initNativeFeatures(navCtrl: NavController) {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.platform.registerBackButtonAction(() => {
        if (navCtrl.canGoBack()) {
          navCtrl.pop();
        } else {
          this.notificationService.ask('app.exit-title', 'app.exit-message').subscribe(
            response => {
              if (response) {
                this.platform.exitApp()
              }
            }
          )
        }
      });
    });
  }

  public feedBack() {
    this.deviceFeedBack.haptic(0);
    this.deviceFeedBack.acoustic();
  }
}

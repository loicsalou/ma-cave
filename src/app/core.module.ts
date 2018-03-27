import {NgModule, Optional, SkipSelf} from '@angular/core';
import {AlertController, LoadingController, ToastController} from 'ionic-angular';
import {BottlePersistenceService} from '../service/bottle-persistence.service';
import {DistributeService} from '../service/distribute.service';
import {TranslateService} from '@ngx-translate/core';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {BottleFactory} from '../model/bottle.factory';
import '../../node_modules/chart.js/dist/Chart.bundle.min.js';
import {ImagePersistenceService} from '../service/image-persistence.service';
import {Bottles} from '../config/Bottles';
import {AnonymousLoginService} from '../service/anonymous-login.service';
import {EmailLoginService} from '../service/email-login.service';
import {Facebook} from '@ionic-native/facebook';
import {LoginService} from '../service/login.service';
import {FacebookLoginService} from '../service/facebook-login.service';
import {NotificationService} from '../service/notification.service';
import {LockerFactory} from '../model/locker.factory';
import {FirebaseConnectionService} from '../service/firebase-connection.service';
import {NativeStorageService} from '../service/native-storage.service';
import {NativeStorage} from '@ionic-native/native-storage';
import {LocalLoginService} from '../service/local-login.service';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {HttpClient} from '@angular/common/http';
import {GoogleLoginService} from '../service/google-login.service';
import {GooglePlus} from '@ionic-native/google-plus';
import {WithdrawalFactory} from '../model/withdrawal.factory';
import {CommonModule} from '@angular/common';

export const fireConfig = {
  apiKey: 'AIzaSyBhSvUzx7FAk1pkTDH3TpxRVzsNwkkqo7w',
  authDomain: 'ma-cave-15a66.firebaseapp.com',
  databaseURL: 'https://ma-cave-15a66.firebaseio.com',
  projectId: 'ma-cave-15a66',
  storageBucket: 'ma-cave-15a66.appspot.com',
  messagingSenderId: '58435015061'
}

@NgModule({
            imports: [
              AngularFireModule.initializeApp(fireConfig),
              AngularFireAuthModule,
              AngularFireDatabaseModule
            ],
            providers: [
              AnonymousLoginService,
              BottleFactory,
              WithdrawalFactory,
              Bottles,
              BottlePersistenceService,
              AndroidPermissions,
              DistributeService,
              EmailLoginService,
              Facebook,
              FacebookLoginService,
              GooglePlus,
              HttpClient,
              ImagePersistenceService,
              FirebaseConnectionService,
              LocalLoginService,
              GoogleLoginService,
              LockerFactory,
              {
                provide: LoginService,
                useFactory: (createLoginFactory),
                deps: [ AnonymousLoginService, EmailLoginService, FacebookLoginService, LocalLoginService, GoogleLoginService,
                  NotificationService, NativeStorageService ]
              },
              NativeStorage,
              NativeStorageService,
              {
                provide: NotificationService,
                useFactory: (createNotificationFactory),
                deps: [ AlertController, ToastController, TranslateService, LoadingController ]
              },
              SplashScreen,
              StatusBar,
              TranslateService
            ]
          })
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('Le CoreModule est déjà chargé et ne doit l\'être que depuis l\'AppModule.');
    }
  }
}

export function createLoginFactory(ano: AnonymousLoginService, ema: EmailLoginService, fac: FacebookLoginService,
                                   lls: LocalLoginService, ggl: GoogleLoginService, ns: NotificationService, lss: NativeStorageService) {
  return new LoginService(ano, ema, fac, lls, ggl, ns, lss);
}

export function createNotificationFactory(alrt: AlertController, toast: ToastController, translate: TranslateService,
                                          loadingCtrl: LoadingController) {
  return new NotificationService(alrt, toast, translate, loadingCtrl);
}

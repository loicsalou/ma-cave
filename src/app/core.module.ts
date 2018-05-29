import {NgModule, Optional, SkipSelf} from '@angular/core';
import {AlertController, LoadingController, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import '../../node_modules/chart.js/dist/Chart.bundle.min.js';
import {AnonymousLoginService} from '../service/login/anonymous-login.service';
import {EmailLoginService} from '../service/login/email-login.service';
import {Facebook} from '@ionic-native/facebook';
import {LoginService} from '../service/login/login.service';
import {FacebookLoginService} from '../service/login/facebook-login.service';
import {NotificationService} from '../service/notification.service';
import {LockerFactory} from '../model/locker.factory';
import {HttpClient} from '@angular/common/http';
import {GoogleLoginService} from '../service/login/google-login.service';
import {GooglePlus} from '@ionic-native/google-plus';
import {appConfig} from './app.conf';
import {ApplicationState, META_REDUCERS, ROOT_REDUCERS} from './state/app.state';
import {Store, StoreModule} from '@ngrx/store';
import {BrowserModule} from '@angular/platform-browser';
import {BottlesEffectsService} from './state/bottle.effects';
import {SharedEffectsService} from './state/shared.effects';
import {environment} from '../environments/environment';
import {WithdrawalsEffectsService} from './state/withdrawals.effects';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {SharedPersistenceService} from '../service/shared-persistence.service';
import {BottleFactory} from '../model/bottle.factory';
import {DistributeService} from '../service/distribute.service';
import {FirebaseImagesService} from '../service/firebase/firebase-images.service';
import {FirebaseBottlesService} from '../service/firebase/firebase-bottles.service';
import {FirebaseLockersService} from '../service/firebase/firebase-lockers.service';
import {CellarPersistenceService} from '../service/cellar-persistence.service';
import {BottlePersistenceService} from '../service/bottle-persistence.service';
import {FirebaseAdminService} from '../service/firebase/firebase-admin.service';
import {WithdrawalFactory} from '../model/withdrawal.factory';
import {FirebaseWithdrawalsService} from '../service/firebase/firebase-withdrawals.service';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {FacebookLoginNativeService} from '../service/login/facebook-login-native.service';

export const fireConfig = {
  apiKey: 'AIzaSyBhSvUzx7FAk1pkTDH3TpxRVzsNwkkqo7w',
  authDomain: 'ma-cave-15a66.firebaseapp.com',
  databaseURL: 'https://ma-cave-15a66.firebaseio.com',
  projectId: 'ma-cave-15a66',
  storageBucket: 'ma-cave-15a66.appspot.com',
  messagingSenderId: '58435015061'
};

let config = new AuthServiceConfig([
                                     {
                                       id: FacebookLoginProvider.PROVIDER_ID,
                                       provider: new FacebookLoginProvider("253712085111353")
                                     }
                                   ]);

@NgModule({
            imports: [
              BrowserModule,
              AngularFireModule.initializeApp(fireConfig),
              AngularFireAuthModule,
              AngularFireDatabaseModule,
              AngularFireStorageModule,
              SocialLoginModule.initialize(config),
              StoreModule.forRoot(ROOT_REDUCERS, {
                metaReducers: META_REDUCERS
              }),
              EffectsModule.forRoot([ BottlesEffectsService, WithdrawalsEffectsService, SharedEffectsService ]),
              !environment.production ? StoreDevtoolsModule.instrument({maxAge: 50}) : []
            ],
            providers: [
              {provide: 'GLOBAL_CONFIG', useValue: appConfig},
              HttpClient,
              TranslateService,

              AnonymousLoginService,
              EmailLoginService,
              Facebook,
              FacebookLoginService,
              FacebookLoginNativeService,
              GoogleLoginService,
              GooglePlus,
              {
                provide: LoginService,
                useFactory: (createLoginFactory),
                deps: [ AnonymousLoginService, EmailLoginService, FacebookLoginService, FacebookLoginNativeService,
                  GoogleLoginService, TranslateService, NotificationService, Store ]
              },
              {
                provide: NotificationService,
                useFactory: (createNotificationFactory),
                deps: [ AlertController, ToastController, TranslateService, LoadingController ]
              },

              LockerFactory,
              BottleFactory,
              WithdrawalFactory,
              BottlePersistenceService,
              CellarPersistenceService,
              DistributeService,
              SharedPersistenceService,
              FirebaseAdminService,
              FirebaseLockersService,
              FirebaseImagesService,
              FirebaseBottlesService,
              FirebaseWithdrawalsService
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
                                   facn: FacebookLoginNativeService, ggl: GoogleLoginService, ts: TranslateService,
                                   ac: AlertController, store: Store<ApplicationState>) {
  return new LoginService(ano, ema, fac, facn, ggl, ts, ac, store);
}

export function createNotificationFactory(alrt: AlertController, toast: ToastController, translate: TranslateService,
                                          loadingCtrl: LoadingController) {
  return new NotificationService(alrt, toast, translate, loadingCtrl);
}

import {ErrorHandler, NgModule} from '@angular/core';
import {
  AlertController,
  IonicApp,
  IonicErrorHandler,
  IonicModule,
  LoadingController,
  ToastController
} from 'ionic-angular';
import {MyCaveApp} from './app.component';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {BrowsePage} from '../pages/browse/browse.page';
import {BottlePersistenceService} from '../service/bottle-persistence.service';
import {DistributeService} from '../service/distribute.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Http, HttpModule} from '@angular/http';
import {BottleDetailPage} from '../pages/bottle-detail/page-bottle-detail';
import {UpdatePage} from '../pages/update/update.page';
import {Camera} from '@ionic-native/camera';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {BrowserModule} from '@angular/platform-browser';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {BottleFactory} from '../model/bottle.factory';
import {UploadBottlesModule} from '../pages/upload-bottles/upload-bottles.page.module';
import {UploadBottlesPage} from '../pages/upload-bottles/upload-bottles.page';
import {ChartsModule} from 'ng2-charts';
import '../../node_modules/chart.js/dist/Chart.bundle.min.js';
import {EmailLoginPage} from '../pages/login/email-login.page';
import {ImagePersistenceService} from '../service/image-persistence.service';
import {Bottles} from '../components/config/Bottles';
import {AnonymousLoginService} from '../service/anonymous-login.service';
import {EmailLoginService} from '../service/email-login.service';
import {Facebook} from '@ionic-native/facebook';
import {LoginService} from '../service/login.service';
import {FacebookLoginService} from '../service/facebook-login.service';
import {DashboardPage} from '../pages/dashboard/dashboard';
import {ProfilePageModule} from '../pages/profile/profile.module';
import {NotificationService} from '../service/notification.service';
import {DefaultImageDirective} from '../directives/default-image/default-image';
import {DashboardPageModule} from '../pages/dashboard/dashboard.module';
import {StatisticsComponentModule} from '../components/statistics/statistics.component.module';
import {StatisticsComponent} from '../components/statistics/statistics.component';
import {Statistics} from '../model/statistics';
import {SharedModule} from '../components/shared.module';
import {BrowseModule} from '../pages/browse/browse.module';
import {BottleDetailModule} from '../pages/bottle-detail/bottle-detail.module';
import {LockerFactory} from '../model/locker.factory';
import {CellarPage} from '../pages/cellar/cellar.page';
import {CellarPageModule} from '../pages/cellar/cellar.page.module';
import {FirebaseConnectionService} from '../service/firebase-connection.service';

export const fireConfig = {
  apiKey: 'AIzaSyBhSvUzx7FAk1pkTDH3TpxRVzsNwkkqo7w',
  authDomain: 'ma-cave-15a66.firebaseapp.com',
  databaseURL: 'https://ma-cave-15a66.firebaseio.com',
  projectId: 'ma-cave-15a66',
  storageBucket: 'ma-cave-15a66.appspot.com',
  messagingSenderId: '58435015061'
}

@NgModule({
            declarations: [
              MyCaveApp,
              ContactPage,
              EmailLoginPage,
              HomePage,
              TabsPage
            ],
            imports: [
              IonicModule.forRoot(MyCaveApp),
              AngularFireModule.initializeApp(fireConfig),
              AngularFireAuthModule,
              AngularFireDatabaseModule,
              BottleDetailModule,
              BrowseModule,
              BrowserModule,
              CellarPageModule,
              ChartsModule,
              DashboardPageModule,
              HttpModule,
              ProfilePageModule,
              SharedModule,
              StatisticsComponentModule,
              TranslateModule.forRoot({
                                        loader: {
                                          provide: TranslateLoader,
                                          useFactory: (createTranslateLoader),
                                          deps: [ Http ]
                                        }
                                      }),
              UploadBottlesModule
            ],
            bootstrap: [ IonicApp ],
            entryComponents: [
              BottleDetailPage,
              BrowsePage,
              CellarPage,
              ContactPage,
              DashboardPage,
              EmailLoginPage,
              HomePage,
              MyCaveApp,
              TabsPage,
              UploadBottlesPage,
              UpdatePage
            ],
            providers: [
              AnonymousLoginService,
              BottleFactory,
              Bottles,
              BottlePersistenceService,
              Camera,
              DistributeService,
              EmailLoginService,
              {provide: ErrorHandler, useClass: IonicErrorHandler},
              Facebook,
              FacebookLoginService,
              ImagePersistenceService,
              FirebaseConnectionService,
              LockerFactory,
              {
                provide: LoginService,
                useFactory: (createLoginFactory),
                deps: [ AnonymousLoginService, EmailLoginService, FacebookLoginService, NotificationService ]
              },
              {
                provide: NotificationService,
                useFactory: (createNotificationFactory),
                deps: [ AlertController, ToastController, TranslateService, LoadingController ]
              },
              SplashScreen,
              Statistics,
              StatusBar
            ], exports: [
    StatisticsComponent,
    DefaultImageDirective
  ]
          })
export class AppModule {
}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function createLoginFactory(ano: AnonymousLoginService, ema: EmailLoginService, fac: FacebookLoginService,
                                   ns: NotificationService) {
  return new LoginService(ano, ema, fac, ns);
}

export function createNotificationFactory(alrt: AlertController, toast: ToastController, translate: TranslateService,
                                          loadingCtrl: LoadingController) {
  return new NotificationService(alrt, toast, translate, loadingCtrl);
}

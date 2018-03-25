import {NgModule} from '@angular/core';
import {AlertController, IonicApp, IonicModule, LoadingController, ToastController} from 'ionic-angular';
import {MyCaveApp} from './app.component';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {BrowsePage} from '../pages/browse/browse.page';
import {BottlePersistenceService} from '../service/bottle-persistence.service';
import {DistributeService} from '../service/distribute.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BottleDetailPage} from '../pages/bottle-detail/page-bottle-detail';
import {UpdatePage} from '../pages/update/update.page';
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
import {StatisticsComponent} from '../components/statistics/statistics.component';
import {Statistics} from '../model/statistics';
import {SharedModule} from '../components/shared.module';
import {BrowseModule} from '../pages/browse/browse.module';
import {BottleDetailModule} from '../pages/bottle-detail/bottle-detail.module';
import {LockerFactory} from '../model/locker.factory';
import {CellarPage} from '../pages/cellar/cellar.page';
import {CellarPageModule} from '../pages/cellar/cellar.page.module';
import {FirebaseConnectionService} from '../service/firebase-connection.service';
import {NativeStorageService} from '../service/native-storage.service';
import {NativeStorage} from '@ionic-native/native-storage';
import {LocalLoginService} from '../service/local-login.service';
import {LocalLoginPage} from '../pages/login/local-login.page';
import {LockerEditorPageModule} from '../pages/locker-editor/locker-editor.page.module';
import {LockerEditor2PageModule} from '../pages/locker-editor2/locker-editor2.page.module';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TestPageModule} from '../pages/test/test.module';
import {GoogleLoginService} from '../service/google-login.service';
import {GooglePlus} from '@ionic-native/google-plus';
import {WithdrawalFactory} from '../model/withdrawal.factory';

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
              StatisticsComponent,
              EmailLoginPage,
              LocalLoginPage,
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
              LockerEditorPageModule,
              LockerEditor2PageModule,
              DashboardPageModule,
              HttpClientModule,
              ProfilePageModule,
              SharedModule,
              TranslateModule.forRoot({
                                        loader: {
                                          provide: TranslateLoader,
                                          useFactory: (createTranslateLoader),
                                          deps: [ HttpClient ]
                                        }
                                      }),
              UploadBottlesModule,
              TestPageModule
            ],
            bootstrap: [ IonicApp ],
            entryComponents: [
              BottleDetailPage,
              BrowsePage,
              CellarPage,
              ContactPage,
              DashboardPage,
              EmailLoginPage,
              LocalLoginPage,
              HomePage,
              MyCaveApp,
              TabsPage,
              UploadBottlesPage,
              UpdatePage
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
              Statistics,
              StatusBar
            ],
            exports: [
              StatisticsComponent,
              DefaultImageDirective
            ]
          })
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function createLoginFactory(ano: AnonymousLoginService, ema: EmailLoginService, fac: FacebookLoginService,
                                   lls: LocalLoginService, ggl: GoogleLoginService, ns: NotificationService, lss: NativeStorageService) {
  return new LoginService(ano, ema, fac, lls, ggl, ns, lss);
}

export function createNotificationFactory(alrt: AlertController, toast: ToastController, translate: TranslateService,
                                          loadingCtrl: LoadingController) {
  return new NotificationService(alrt, toast, translate, loadingCtrl);
}

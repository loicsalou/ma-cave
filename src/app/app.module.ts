import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyCaveApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {BrowsePage} from '../pages/browse/browse.page';
import {BottleService} from '../service/firebase-bottle.service';
import {DistributeService} from '../service/distribute.service';
import {DistributionComponent} from '../components/distribution/distribution';
import {BottleIconPipe} from '../components/list/bottle-item-component/bottle-icon.pipe';
import {BottleListComponent} from '../components/list/bottle-list.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Http, HttpModule} from '@angular/http';
import {BottleDetailPage} from '../pages/bottle-detail/page-bottle-detail';
import {BottleDetailSlide} from '../pages/bottle-detail/slide-bottle-detail';
import {UpdatePage} from '../pages/update/update.page';
import {Camera} from '@ionic-native/camera';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {BrowserModule} from '@angular/platform-browser';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {FilterPage} from '../pages/filters/filter.page';
import {BottleFactory} from '../model/bottle.factory';
import {UploadBottlesModule} from '../pages/upload-bottles/upload-bottles.page.module';
import {UploadBottlesPage} from '../pages/upload-bottles/upload-bottles.page';
import {Statistics} from '../model/statistics';
import {StatisticsComponent} from '../components/statistics/statistics';
import {ChartsModule} from 'ng2-charts';
import '../../node_modules/chart.js/dist/Chart.bundle.min.js';
import {EmailLoginPage} from '../pages/login/email-login.page';
import {FirebaseImageService} from '../service/firebase-image.service';
import {Wines} from '../service/wines.service';
import {Bottles} from '../components/config/Bottles';
import {AnonymousLoginService} from '../service/anonymous-login.service';
import {EmailLoginService} from '../service/email-login.service';
import {Facebook} from '@ionic-native/facebook';
import {LoginService} from '../service/login.service';
import {FacebookLoginService} from '../service/facebook-login.service';

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
              AboutPage,
              ContactPage,
              EmailLoginPage,
              FilterPage,
              HomePage,
              BrowsePage,
              BottleDetailPage,
              BottleDetailSlide,
              DistributionComponent,
              BottleIconPipe,
              BottleListComponent,
              TabsPage,
              UpdatePage,
              StatisticsComponent
            ],
            imports: [
              IonicModule.forRoot(MyCaveApp),
              TranslateModule.forRoot({
                                        loader: {
                                          provide: TranslateLoader,
                                          useFactory: (createTranslateLoader),
                                          deps: [ Http ]
                                        }
                                      }),
              BrowserModule,
              HttpModule,
              AngularFireModule.initializeApp(fireConfig),
              AngularFireAuthModule,
              AngularFireDatabaseModule,
              UploadBottlesModule,
              ChartsModule
            ],
            bootstrap: [ IonicApp ],
            entryComponents: [
              MyCaveApp,
              EmailLoginPage,
              AboutPage,
              ContactPage,
              HomePage,
              BrowsePage,
              TabsPage,
              UploadBottlesPage,
              BottleDetailPage,
              UpdatePage
            ],
            providers: [
              BottleFactory,
              Bottles,
              Camera,
              //Platform,
              Statistics,
              StatusBar,
              SplashScreen,
              Facebook,
              AnonymousLoginService,
              EmailLoginService,
              FacebookLoginService,
              {provide: ErrorHandler, useClass: IonicErrorHandler},
              {
                provide: LoginService,
                useFactory: (createLoginFactory),
                deps: [ AnonymousLoginService, EmailLoginService, FacebookLoginService ]
              },
              BottleService,
              DistributeService,
              FirebaseImageService
            ]
          })
export class AppModule {
}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function createLoginFactory(ano: AnonymousLoginService, ema: EmailLoginService, fac: FacebookLoginService) {
  return new LoginService(ano, ema, fac);
}

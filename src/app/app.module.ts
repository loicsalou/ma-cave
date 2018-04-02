import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyCaveApp} from './app.component';
import {ContactPage} from '../_features/admin/contact/contact';
import {HomePage} from './home/home';
import {TabsPage} from './tabs/tabs';
import {BrowsePage} from '../_features/browse/browse/browse.page';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BottleDetailPage} from '../_features/browse/bottle-detail/page-bottle-detail';
import {UpdatePage} from '../_features/browse/update/update.page';
import {BrowserModule} from '@angular/platform-browser';
import {ChartsModule} from 'ng2-charts';
import '../../node_modules/chart.js/dist/Chart.bundle.min.js';
import {EmailLoginPage} from '../_features/admin/login/email-login.page';
import {DashboardPage} from '../_features/browse/dashboard/dashboard';
import {AdminFeatureModule} from '../_features/admin/admin-feature.module';
import {SharedModule} from '../components/shared.module';
import {BrowseFeatureModule} from '../_features/browse/browse-feature.module';
import {BottleDetailModule} from '../_features/browse/bottle-detail/bottle-detail.module';
import {CellarPage} from '../_features/racks/cellar/cellar.page';
import {CellarFeatureModule} from '../_features/racks/cellar-feature.module';
import {LocalLoginPage} from '../_features/admin/login/local-login.page';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core.module';

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
              BrowserModule,
              IonicModule.forRoot(MyCaveApp),
              CoreModule,
              BrowseFeatureModule,
              CellarFeatureModule,
              ChartsModule,
              HttpClientModule,
              AdminFeatureModule,
              SharedModule,
              TranslateModule.forRoot({
                                        loader: {
                                          provide: TranslateLoader,
                                          useFactory: (createTranslateLoader),
                                          deps: [ HttpClient ]
                                        }
                                      })
            ],
            declarations: [
              MyCaveApp,
              ContactPage,
              EmailLoginPage,
              LocalLoginPage,
              HomePage,
              TabsPage
            ],
            entryComponents: [
              BottleDetailPage,
              BrowsePage,
              CellarPage,
              ContactPage,
              DashboardPage,
              EmailLoginPage,
              HomePage,
              LocalLoginPage,
              MyCaveApp,
              TabsPage,
              UpdatePage
            ],
            bootstrap: [ IonicApp ],
          })
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

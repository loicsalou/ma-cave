import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyCaveApp} from './app.component';
import {HomePage} from './home/home';
import {TabsPage} from './tabs/tabs';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import 'chart.js/dist/Chart.bundle.min.js';
import {EmailLoginPage} from './login/email-login.page';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core.module';
import {BottlesEffectsService} from './state/bottle.effects';
import {WithdrawalsEffectsService} from './state/withdrawals.effects';
import {SharedEffectsService} from './state/shared.effects';
import {SharedCoreModule} from '../components/shared-core.module';
import {SplashScreen} from '@ionic-native/splash-screen';

export const fireConfig = {
  apiKey: 'AIzaSyBhSvUzx7FAk1pkTDH3TpxRVzsNwkkqo7w',
  authDomain: 'ma-cave-15a66.firebaseapp.com',
  databaseURL: 'https://ma-cave-15a66.firebaseio.com',
  projectId: 'ma-cave-15a66',
  storageBucket: 'ma-cave-15a66.appspot.com',
  messagingSenderId: '58435015061'
};

@NgModule({
            imports: [
              IonicModule.forRoot(MyCaveApp, {
                                    mode: 'md'
                                  }
              ),
              CoreModule,
              HttpClientModule,
              SharedCoreModule,
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
              EmailLoginPage,
              HomePage,
              TabsPage
            ],
            entryComponents: [
              EmailLoginPage,
              HomePage,
              MyCaveApp,
              TabsPage
            ],
            providers: [
              BottlesEffectsService,
              SharedEffectsService,
              SplashScreen,
              WithdrawalsEffectsService
            ],
            bootstrap: [ IonicApp ]
          })
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

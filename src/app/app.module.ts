import {NgModule} from '@angular/core';
import {IonicApp, IonicModule, NavController} from 'ionic-angular';
import {MyCaveApp} from './app.component';
import {HomePage} from './home/home';
import {TabsPage} from './tabs/tabs';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ChartsModule} from 'ng2-charts';
import 'chart.js/dist/Chart.bundle.min.js';
import {EmailLoginPage} from './login/email-login.page';
import {SharedModule} from '../components/shared.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core.module';
import {StoreModule} from '@ngrx/store';
import {META_REDUCERS, ROOT_REDUCERS} from './state/app.state';
import {EffectsModule} from '@ngrx/effects';
import {BottlesEffectsService} from './state/bottle.effects';
import {environment} from '../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {WithdrawalsEffectsService} from './state/withdrawals.effects';
import {SharedEffectsService} from './state/shared.effects';

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
              IonicModule.forRoot(MyCaveApp),
              CoreModule,
              ChartsModule,
              HttpClientModule,
              SharedModule,
              TranslateModule.forRoot({
                                        loader: {
                                          provide: TranslateLoader,
                                          useFactory: (createTranslateLoader),
                                          deps: [ HttpClient ]
                                        }
                                      }),
              StoreModule.forRoot(ROOT_REDUCERS, {
                metaReducers: META_REDUCERS
              }),
              EffectsModule.forRoot([ BottlesEffectsService, WithdrawalsEffectsService, SharedEffectsService ]),
              !environment.production ? StoreDevtoolsModule.instrument({maxAge: 5}) : []
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
              WithdrawalsEffectsService
            ],
            bootstrap: [ IonicApp ]
          })
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

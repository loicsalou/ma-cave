import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {MyCaveApp} from './app.component';
import {HomePage} from './home/home';
import {TabsPage} from './tabs/tabs';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import 'chart.js/dist/Chart.bundle.min.js';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core.module';
import {BottlesEffectsService} from './state/bottle.effects';
import {WithdrawalsEffectsService} from './state/withdrawals.effects';
import {SharedEffectsService} from './state/shared.effects';
import {SharedCoreModule} from '../components/shared-core.module';
import {
  AuthMethods,
  AuthProvider,
  AuthProviderWithCustomConfig,
  CredentialHelper,
  FirebaseUIAuthConfig,
  FirebaseUIModule
} from 'firebaseui-angular';

const facebookCustomConfig: AuthProviderWithCustomConfig = {
  provider: AuthProvider.Facebook,
  customConfig: {
    scopes: [
      'public_profile',
      'email',
      'user_likes',
      'user_friends'
    ],
    customParameters: {
      // Forces password re-entry.
      // auth_type: 'reauthenticate'
    }
  }
};

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProvider.Google,
    facebookCustomConfig,
    //AuthProvider.Twitter,
    //AuthProvider.Github,
    AuthProvider.Password
    //AuthProvider.Phone
  ],
  method: AuthMethods.Redirect,
  //tos: '<your-tos-link>',  terms of service
  credentialHelper: CredentialHelper.AccountChooser,
  autoUpgradeAnonymousUsers: true,
  disableSignInSuccessCallback: true
};

@NgModule({
            imports: [
              IonicModule.forRoot({
                                    mode: 'md'
                                  }
              ),
              CoreModule,
              HttpClientModule,
              SharedCoreModule,
              FirebaseUIModule.forRoot(firebaseUiAuthConfig),
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
              HomePage,
              TabsPage
            ],
            entryComponents: [
              HomePage,
              MyCaveApp,
              TabsPage
            ],
            providers: [
              BottlesEffectsService,
              SharedEffectsService,
              WithdrawalsEffectsService
            ]
          })
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

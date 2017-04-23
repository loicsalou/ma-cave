import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {AboutPage} from "../pages/about/about";
import {ContactPage} from "../pages/contact/contact";
import {HomePage} from "../pages/home/home";
import {TabsPage} from "../pages/tabs/tabs";
import {BrowsePage} from "../pages/browse/browse.page";
import {BottleService} from "../components/bottle/bottle-firebase.service";
import {BottleItemComponent} from "../components/list/bottle-item-component/bottle-item.component";
import {Browse2Page} from "../pages/browse2/browse2.page";
import {DistributeService} from "../components/distribution/distribute.service";
import {DistributionComponent} from "../components/distribution/distribution";
import {BottleIconPipe} from "../components/list/bottle-item-component/bottle-icon.pipe";
import {BottleListComponent} from "../components/list/bottle-list.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {Http, HttpModule} from "@angular/http";
import {BottleDetailPage} from "../pages/bottle-detail/page-bottle-detail";
import {BottleDetailSlide} from "../pages/bottle-detail/slide-bottle-detail";
import {UpdatePage} from "../pages/update/update";
import {Camera} from "@ionic-native/camera";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {AngularFireModule} from "angularfire2";

export const fireConfig = {
  apiKey: "AIzaSyBhSvUzx7FAk1pkTDH3TpxRVzsNwkkqo7w",
  authDomain: "ma-cave-15a66.firebaseapp.com",
  databaseURL: "https://ma-cave-15a66.firebaseio.com",
  projectId: "ma-cave-15a66",
  storageBucket: "ma-cave-15a66.appspot.com",
  messagingSenderId: "58435015061"
}

@NgModule({
            declarations: [
              MyApp,
              AboutPage,
              ContactPage,
              HomePage,
              Browse2Page,
              BottleDetailPage,
              BottleDetailSlide,
              DistributionComponent,
              BottleItemComponent,
              BottleIconPipe,
              BottleListComponent,
              TabsPage,
              UpdatePage
            ],
            imports: [
              IonicModule.forRoot(MyApp),
              TranslateModule.forRoot({
                                        loader: {
                                          provide: TranslateLoader,
                                          useFactory: (createTranslateLoader),
                                          deps: [ Http ]
                                        }
                                      }),
              HttpModule,
              AngularFireModule.initializeApp(fireConfig)
            ],
            bootstrap: [ IonicApp ],
            entryComponents: [
              MyApp,
              AboutPage,
              ContactPage,
              HomePage,
              Browse2Page,
              TabsPage,
              BottleDetailPage,
              UpdatePage
            ],
            providers: [
              Camera,
              StatusBar,
              SplashScreen,
              {provide: ErrorHandler, useClass: IonicErrorHandler},
              BottleService, DistributeService ]
          })
export class AppModule {
}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

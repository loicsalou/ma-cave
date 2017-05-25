import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyCaveApp} from "./app.component";
import {AboutPage} from "../pages/about/about";
import {ContactPage} from "../pages/contact/contact";
import {HomePage} from "../pages/home/home";
import {TabsPage} from "../pages/tabs/tabs";
import {BrowsePage} from "../pages/browse/browse.page";
import {BottleService} from "../components/bottle/bottle-firebase.service";
import {BottleItemComponent} from "../components/list/bottle-item-component/bottle-item.component";
import {DistributeService} from "../components/distribution/distribute.service";
import {DistributionComponent} from "../components/distribution/distribution";
import {BottleIconPipe} from "../components/list/bottle-item-component/bottle-icon.pipe";
import {BottleListComponent} from "../components/list/bottle-list.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {Http, HttpModule} from "@angular/http";
import {BottleDetailPage} from "../pages/bottle-detail/page-bottle-detail";
import {BottleDetailSlide} from "../pages/bottle-detail/slide-bottle-detail";
import {UpdatePage} from "../pages/update/update.page";
import {Camera} from "@ionic-native/camera";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {BrowserModule} from "@angular/platform-browser";
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {FilterPage} from "../pages/filters/filter.page";

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
              MyCaveApp,
              AboutPage,
              ContactPage,
              FilterPage,
              HomePage,
              BrowsePage,
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
              AngularFireDatabaseModule
            ],
            bootstrap: [ IonicApp ],
            entryComponents: [
              MyCaveApp,
              AboutPage,
              ContactPage,
              HomePage,
              BrowsePage,
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

import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {MyApp} from "./app.component";
import {AboutPage} from "../pages/about/about";
import {ContactPage} from "../pages/contact/contact";
import {HomePage} from "../pages/home/home";
import {TabsPage} from "../pages/tabs/tabs";
import {BrowsePage} from "../pages/browse/browse.page";
import {FranceComponent} from "../components/filter-panel/countries/france/france.component";
import {BottleService} from "../components/bottle/bottle.service";
import {BottleItemComponent} from "../components/list/bottle-item-component/bottle-item.component";
import {ColorChooserComponent} from "../components/filter-panel/color-chooser/color-chooser.component";
import {FilterPanelComponent} from "../components/filter-panel/filter-panel";
import {Browse2Page} from "../pages/browse2/browse2.page";
import {DistributeService} from "../components/distribution/distribute.service";
import {DistributionComponent} from "../components/distribution/distribution";
import {BottleIconPipe} from "../components/list/bottle-item-component/bottle-icon.pipe";
import {BottleListComponent} from "../components/list/bottle-list.component";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpModule, Http} from "@angular/http";
import {BottleDetailPage} from "../pages/bottle-detail/bottle-detail";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    BrowsePage,
    Browse2Page,
    BottleDetailPage,
    ColorChooserComponent,
    FilterPanelComponent,
    FranceComponent,
    DistributionComponent,
    BottleItemComponent,
    BottleIconPipe,
    BottleListComponent,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    BrowsePage,
    Browse2Page,
    TabsPage,
    BottleDetailPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BottleService, DistributeService]
})
export class AppModule {
}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

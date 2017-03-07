import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {MyApp} from "./app.component";
import {AboutPage} from "../pages/about/about";
import {ContactPage} from "../pages/contact/contact";
import {HomePage} from "../pages/home/home";
import {TabsPage} from "../pages/tabs/tabs";
import {BrowsePage} from "../pages/browse/browse.page";
import {FranceComponent} from "../components/filter-panel/countries/france/france.component";
import {BottleService} from "../pages/browse/bottle.service";
import {BottleItemComponent} from "../components/list/bottle-item-component/bottle-item.component";
import {ColorChooserComponent} from "../components/filter-panel/color-chooser/color-chooser.component";
import {FilterPanelComponent} from "../components/filter-panel/filter-panel";
import {Browse2Page} from "../pages/browse2/browse2.page";
import {DistributeService} from "../components/distribution/distribute.service";
import {DistributionComponent} from "../components/distribution/distribution";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    BrowsePage,
    Browse2Page,
    ColorChooserComponent,
    FilterPanelComponent,
    FranceComponent,
    DistributionComponent,
    BottleItemComponent,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    BrowsePage,
    Browse2Page,
    TabsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BottleService, DistributeService]
})
export class AppModule {
}

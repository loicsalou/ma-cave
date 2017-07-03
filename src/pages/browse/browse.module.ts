import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {DefaultImageDirective} from './default-image/default-image';
import {BrowsePage} from './browse.page';
import {BrowserModule} from '@angular/platform-browser';
import {BottleListComponent} from '../../components/list/bottle-list.component';
import {FilterPage} from '../filters/filter.page';
import {DistributionComponent} from '../../components/distribution/distribution';
import {SharedModule} from '../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
            declarations: [
              BrowsePage,
              BottleListComponent,
              FilterPage,
              DistributionComponent
            ],
            imports: [
              IonicModule,
              BrowserModule,
              SharedModule,
              TranslateModule
            ],
            exports: [
              BrowsePage,
              BottleListComponent,
              FilterPage,
              DistributionComponent
            ]
          })
export class BrowseModule {
}

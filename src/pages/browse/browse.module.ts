import {NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {BrowsePage} from './browse.page';
import {BrowserModule} from '@angular/platform-browser';
import {BottleItemComponent} from '../../components/list/bottle-item.component';
import {FilterPage} from '../filters/filter.page';
import {DistributionComponent} from '../../components/distribution/distribution';
import {SharedModule} from '../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
            declarations: [
              BrowsePage,
              BottleItemComponent,
              FilterPage,
              DistributionComponent
            ],
            imports: [
              IonicModule,
              IonicPageModule.forChild(BrowsePage),
              BrowserModule,
              SharedModule,
              TranslateModule
            ],
            exports: [
              BrowsePage,
              BottleItemComponent,
              FilterPage,
              DistributionComponent
            ]
          })
export class BrowseModule {
}

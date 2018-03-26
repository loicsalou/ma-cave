import {NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {BrowsePage} from './browse/browse.page';
import {BrowserModule} from '@angular/platform-browser';
import {FilterPage} from './filters/filter.page';
import {SharedModule} from '../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {DashboardPage} from './dashboard/dashboard';
import {RecordOutputPage} from './record-output/record-output';
import {BottleDetailPage} from './bottle-detail/page-bottle-detail';
import {UpdatePage} from './update/update.page';
import {BottleDetailSlide} from './bottle-detail/slide-bottle-detail';
import {PopoverPage} from './popover/popover.page';

const pages = [
  BottleDetailPage,
  BottleDetailSlide,
  BrowsePage,
  DashboardPage,
  FilterPage,
  PopoverPage,
  RecordOutputPage,
  UpdatePage
];

@NgModule({
            imports: [
              IonicModule,
              IonicPageModule.forChild(BrowsePage),
              BrowserModule,
              SharedModule,
              TranslateModule
            ],
            declarations: [
              ...pages
            ],
            entryComponents: [
              ...pages
            ],
            exports: [
              BrowsePage
            ]
          })
export class BrowseFeatureModule {
}

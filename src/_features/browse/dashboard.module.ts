import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {BrowsePage} from './browse/browse-page';
import {SharedModule} from '../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {BottleDetailPage} from './bottle-detail/bottle-detail-page';
import {SlideBottleDetail} from './bottle-detail/slide-bottle-detail';
import {DashboardPage} from './dashboard';
import {FilterPage} from './filters/filter.page';
import {PopoverPage} from './popover/popover.page';
import {CommonModule} from '@angular/common';

const pages = [
  DashboardPage,
  PopoverPage
];

@NgModule({
            imports: [
              IonicModule,
              IonicPageModule.forChild(DashboardPage),
              CommonModule,
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
              ...pages ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
          })
export class DashboardModule {
}

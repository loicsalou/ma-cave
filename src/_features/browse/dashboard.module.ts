import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {SharedModule} from '../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {DashboardPage} from './dashboard';
import {PopoverPage} from './popover/popover.page';
import {CommonModule} from '@angular/common';
import {ChartsModule} from 'ng2-charts';
import {ChartComponent} from '../../components/chart/chart.component';
import {StatisticsComponent} from '../../components/statistics/statistics.component';

const pages = [
  DashboardPage,
  PopoverPage,
  ChartComponent,
  StatisticsComponent
];

@NgModule({
            imports: [
              IonicModule,
              IonicPageModule.forChild(DashboardPage),
              CommonModule,
              ChartsModule,
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

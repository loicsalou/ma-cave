import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {SharedModule} from '../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {DashboardPage} from './dashboard';
import {CommonModule} from '@angular/common';
import {ChartsModule} from 'ng2-charts';
import {ChartComponent} from '../../components/chart/chart.component';
import {StatisticsComponent} from '../../components/statistics/statistics.component';
import {PopoverPageModule} from './popover/popover-page.module';

const pages = [
  DashboardPage,
  ChartComponent,
  StatisticsComponent
];

@NgModule({
            imports: [
              IonicModule,
              CommonModule,
              ChartsModule,
              PopoverPageModule,
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

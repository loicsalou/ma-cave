import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import {StatisticsComponentModule} from '../../components/statistics/statistics.component.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    StatisticsComponentModule,
    TranslateModule
  ],
  exports: [
    DashboardPage
  ]
})
export class DashboardPageModule {}

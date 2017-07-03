import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import {StatisticsComponentModule} from '../../components/statistics/statistics.module';

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    StatisticsComponentModule
  ],
  exports: [
    DashboardPage
  ]
})
export class DashboardPageModule {}

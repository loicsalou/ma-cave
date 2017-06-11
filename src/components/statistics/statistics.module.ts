import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticsComponent } from './statistics';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  declarations: [
    StatisticsComponent,
  ],
  imports: [
    IonicPageModule.forChild(StatisticsComponent),
    ChartsModule
  ],
  exports: [
    StatisticsComponent
  ]
})
export class StatisticsComponentModule {}

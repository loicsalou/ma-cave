import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticsComponent } from './statistics';

@NgModule({
  declarations: [
    StatisticsComponent,
  ],
  imports: [
    IonicPageModule.forChild(StatisticsComponent),
  ],
  exports: [
    StatisticsComponent
  ]
})
export class StatisticsComponentModule {}

import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {StatisticsComponent} from './statistics.component';
import {ChartsModule} from 'ng2-charts';
import {SharedModule} from '../shared.module';

@NgModule({
            declarations: [
              StatisticsComponent,
            ],
            imports: [
              IonicPageModule.forChild(StatisticsComponent),
              ChartsModule,
              SharedModule
            ],
            exports: [
              StatisticsComponent
            ]
          })
export class StatisticsComponentModule {
}

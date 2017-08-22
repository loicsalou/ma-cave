import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {DefaultImageDirective} from '../directives/default-image/default-image';
import {BottleIconPipe} from './list/bottle-item-component/bottle-icon.pipe';
import {ImageAttacherComponent} from './image-attacher/image-attacher';
import {ProgressBarComponent} from './progress-bar/progress-bar';
import {ChartComponent} from './chart/chart.component';
import {ChartsModule} from 'ng2-charts';
import {DeviceFeedback} from '@ionic-native/device-feedback';
import {ImportProvider} from '../providers/import/import';

@NgModule({
            declarations: [
              BottleIconPipe,
              ChartComponent,
              DefaultImageDirective,
              ImageAttacherComponent,
              ProgressBarComponent
            ],
            imports: [
              ChartsModule,
              IonicModule
            ],
            exports: [
              BottleIconPipe,
              ChartComponent,
              DefaultImageDirective,
              ImageAttacherComponent,
              ProgressBarComponent
            ],
            providers: [
              DeviceFeedback,
              ImportProvider
            ]
          })
export class SharedModule {
}

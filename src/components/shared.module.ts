import {ErrorHandler, NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {DefaultImageDirective} from '../directives/default-image/default-image';
import {BottleIconPipe} from './list/bottle-icon.pipe';
import {ImageAttacherComponent} from './image-attacher/image-attacher';
import {ProgressBarComponent} from './progress-bar/progress-bar';
import {ChartComponent} from './chart/chart.component';
import {ChartsModule} from 'ng2-charts';
import {DeviceFeedback} from '@ionic-native/device-feedback';
import {ImportProvider} from '../providers/import/import';
import {NativeProvider} from '../providers/native/native';
import {Network} from '@ionic-native/network';
import {Camera} from '@ionic-native/camera';
import {CaveErrorHandler} from '../service/cave-error.handler';
import {FirebaseConnectionService} from '../service/firebase-connection.service';
import {RatingComponent} from './rating/rating';
import {FormsModule} from '@angular/forms';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {BottleNotingComponent} from './bottle-noting/bottle-noting.component';

@NgModule({
            declarations: [
              BottleIconPipe,
              ChartComponent,
              DefaultImageDirective,
              ImageAttacherComponent,
              ProgressBarComponent,
              RatingComponent,
              BottleNotingComponent
            ],
            imports: [
              ChartsModule,
              FormsModule,
              IonicModule,
              TranslateModule
            ],
            exports: [
              BottleIconPipe,
              ChartComponent,
              DefaultImageDirective,
              ImageAttacherComponent,
              ProgressBarComponent,
              RatingComponent,
              TranslatePipe,
              RatingComponent,
              BottleNotingComponent
            ],
            providers: [
              Camera,
              DeviceFeedback,
              NativeProvider,
              Network,
              ImportProvider,
              {provide: ErrorHandler, deps: [ FirebaseConnectionService ], useClass: CaveErrorHandler}
            ]
          })
export class SharedModule {
}

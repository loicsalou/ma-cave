import {ErrorHandler, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
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
import {FirebaseAdminService} from '../service/firebase/firebase-admin.service';
import {RatingComponent} from './rating/rating';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {BottleNotingComponent} from './bottle-noting/bottle-noting.component';
import {BottleItemComponent} from './list/bottle-item.component';
import {WithdrawalItemComponent} from './withdrawal-item/withdrawal-item.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {DistributionComponent} from './distribution/distribution';
import {SimpleLockerComponent} from './locker/simple-locker.component';
import {FridgeLockerComponent} from './locker/fridge-locker.component';
import {CommonModule} from '@angular/common';
import {BottleClassPipe} from './list/bottle-color-class.pipe';
import {CurrentFiltersComponent} from './current-filters/current-filters';
import {SearchBarComponent} from './search-bar/search-bar';
import {BottleActionComponent} from './bottle-action/bottle-action';
import {ResponsiveWrapperComponent} from './responsive-wrapper/responsive-wrapper';
import {ScrollAnchorDirective} from './scroll-anchor.directive';
import {RackDirective} from './rack.directive';
import {DimensionOfDirective} from './dimension-of.directive';

@NgModule({
            imports: [
              ChartsModule,
              CommonModule,
              FormsModule,
              IonicModule,
              TranslateModule
            ],
            declarations: [
              BottleActionComponent,
              BottleIconPipe,
              BottleClassPipe,
              BottleItemComponent,
              BottleNotingComponent,
              ChartComponent,
              DimensionOfDirective,
              CurrentFiltersComponent,
              DefaultImageDirective,
              DistributionComponent,
              FridgeLockerComponent,
              ImageAttacherComponent,
              ProgressBarComponent,
              RatingComponent,
              ResponsiveWrapperComponent,
              ScrollAnchorDirective,
              SearchBarComponent,
              SimpleLockerComponent,
              StatisticsComponent,
              WithdrawalItemComponent
            ],
            exports: [
              BottleActionComponent,
              BottleIconPipe,
              BottleClassPipe,
              BottleItemComponent,
              BottleNotingComponent,
              ChartComponent,
              DimensionOfDirective,
              CurrentFiltersComponent,
              DefaultImageDirective,
              DistributionComponent,
              FridgeLockerComponent,
              ImageAttacherComponent,
              ProgressBarComponent,
              RatingComponent,
              ResponsiveWrapperComponent,
              ScrollAnchorDirective,
              SearchBarComponent,
              SimpleLockerComponent,
              StatisticsComponent,
              WithdrawalItemComponent
            ],
            providers: [
              Camera,
              DeviceFeedback,
              NativeProvider,
              Network,
              ImportProvider,
              {provide: ErrorHandler, deps: [ FirebaseAdminService ], useClass: CaveErrorHandler}
            ],
            schemas: [
              NO_ERRORS_SCHEMA
            ]
          })
export class SharedModule {
}

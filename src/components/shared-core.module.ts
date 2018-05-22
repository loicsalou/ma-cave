import {ErrorHandler, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {DefaultImageDirective} from '../directives/default-image/default-image';
import {BottleIconPipe} from './list/bottle-icon.pipe';
import {ProgressBarComponent} from './progress-bar/progress-bar';
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
import {ZoomableDirective} from './zoomable.directive';
import {SharedPersistenceService} from '../service/shared-persistence.service';
import {BottleFactory} from '../model/bottle.factory';
import {DistributeService} from '../service/distribute.service';
import {FirebaseImagesService} from '../service/firebase/firebase-images.service';
import {FirebaseBottlesService} from '../service/firebase/firebase-bottles.service';
import {FirebaseLockersService} from '../service/firebase/firebase-lockers.service';
import {CellarPersistenceService} from '../service/cellar-persistence.service';
import {BottlePersistenceService} from '../service/bottle-persistence.service';
import {WithdrawalFactory} from '../model/withdrawal.factory';
import {FirebaseWithdrawalsService} from '../service/firebase/firebase-withdrawals.service';

@NgModule({
            imports: [
              CommonModule
            ],
            declarations: [
              ResponsiveWrapperComponent
            ],
            exports: [
              ResponsiveWrapperComponent
            ],
            schemas: [
              NO_ERRORS_SCHEMA
            ]
          })
export class SharedCoreModule {
}

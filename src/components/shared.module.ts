import {ErrorHandler, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {AlertController, IonicModule, LoadingController, ToastController} from 'ionic-angular';
import {DefaultImageDirective} from '../directives/default-image/default-image';
import {BottleIconPipe} from './list/bottle-icon.pipe';
import {ProgressBarComponent} from './progress-bar/progress-bar';
import {CaveErrorHandler} from '../service/cave-error.handler';
import {FirebaseAdminService} from '../service/firebase/firebase-admin.service';
import {RatingComponent} from './rating/rating';
import {FormsModule} from '@angular/forms';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {BottleNotingComponent} from './bottle-noting/bottle-noting.component';
import {BottleItemComponent} from './list/bottle-item.component';
import {WithdrawalItemComponent} from './withdrawal-item/withdrawal-item.component';
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
import {SharedCoreModule} from './shared-core.module';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {SplashScreen} from '@ionic-native/splash-screen';
import {DeviceFeedback} from '@ionic-native/device-feedback';
import {StatusBar} from '@ionic-native/status-bar';
import {Network} from '@ionic-native/network';
import {NativeProvider} from '../providers/native/native';
import {NotificationService} from '../service/notification.service';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              IonicModule,
              SharedCoreModule,
              TranslateModule
            ],
            declarations: [
              BottleActionComponent,
              BottleIconPipe,
              BottleClassPipe,
              BottleItemComponent,
              BottleNotingComponent,
              DimensionOfDirective,
              CurrentFiltersComponent,
              DefaultImageDirective,
              DistributionComponent,
              FridgeLockerComponent,
              ProgressBarComponent,
              RatingComponent,
              ScrollAnchorDirective,
              SearchBarComponent,
              SimpleLockerComponent,
              WithdrawalItemComponent,
              ZoomableDirective
            ],
            exports: [
              ResponsiveWrapperComponent,
              BottleActionComponent,
              BottleIconPipe,
              BottleClassPipe,
              BottleItemComponent,
              BottleNotingComponent,
              DimensionOfDirective,
              CurrentFiltersComponent,
              DefaultImageDirective,
              DistributionComponent,
              FridgeLockerComponent,
              ProgressBarComponent,
              RatingComponent,
              ScrollAnchorDirective,
              SearchBarComponent,
              SimpleLockerComponent,
              WithdrawalItemComponent,
              ZoomableDirective
            ],
            providers: [
              NativeProvider,
              AndroidPermissions,
              DeviceFeedback,
              Network,
              SplashScreen,
              StatusBar,
              {provide: ErrorHandler, deps: [ FirebaseAdminService ], useClass: CaveErrorHandler}
            ],
            schemas: [
              NO_ERRORS_SCHEMA
            ]
          })
export class SharedModule {
}

export function createNotificationFactory(alrt: AlertController, toast: ToastController, translate: TranslateService,
                                          loadingCtrl: LoadingController) {
  return new NotificationService(alrt, toast, translate, loadingCtrl);
}

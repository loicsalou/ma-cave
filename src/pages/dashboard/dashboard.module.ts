import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {DashboardPage} from './dashboard';
import {StatisticsComponentModule} from '../../components/statistics/statistics.component.module';
import {TranslateModule} from '@ngx-translate/core';
import {NativeStorageService} from '../../service/native-storage.service';
import {PopoverPage} from './popover.page';

@NgModule({
            declarations: [
              DashboardPage,
              PopoverPage
            ],
            imports: [
              IonicPageModule.forChild(DashboardPage),
              StatisticsComponentModule,
              TranslateModule
            ],
            exports: [
              DashboardPage
            ],
            entryComponents: [
              PopoverPage
            ],
            providers: [
              NativeStorageService
            ]
          })
export class DashboardPageModule {
}

import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {DashboardPage} from './dashboard';
import {StatisticsComponentModule} from '../../components/statistics/statistics.component.module';
import {TranslateModule} from '@ngx-translate/core';
import {NativeStorageService} from '../../service/native-storage.service';

@NgModule({
            declarations: [
              DashboardPage,
            ],
            imports: [
              IonicPageModule.forChild(DashboardPage),
              StatisticsComponentModule,
              TranslateModule
            ],
            exports: [
              DashboardPage
            ],
            providers: [
              NativeStorageService
            ]
          })
export class DashboardPageModule {
}

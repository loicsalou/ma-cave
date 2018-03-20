import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {DashboardPage} from './dashboard';
import {TranslateModule} from '@ngx-translate/core';
import {NativeStorageService} from '../../service/native-storage.service';
import {PopoverPage} from './popover.page';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../../components/shared.module';

@NgModule({
            declarations: [
              DashboardPage,
              PopoverPage
            ],
            imports: [
              IonicModule,
              BrowserModule,
              SharedModule,
              IonicPageModule.forChild(DashboardPage),
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
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
          })
export class DashboardPageModule {
}

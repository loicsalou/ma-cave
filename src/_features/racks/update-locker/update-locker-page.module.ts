import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {CellarPage} from './cellar-page';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../components/shared.module';
import {UpdateLockerPage} from './update-locker-page';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              IonicModule,
              IonicPageModule.forChild(UpdateLockerPage),
              SharedModule,
              TranslateModule.forChild()
            ],
            declarations: [
              UpdateLockerPage
            ],
            entryComponents: [
              UpdateLockerPage
            ],
            exports: [
              UpdateLockerPage
            ],
            schemas: [
              CUSTOM_ELEMENTS_SCHEMA
            ]
          })
export class UpdateLockerPageModule {
}

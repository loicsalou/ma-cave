import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {CellarPage} from './cellar-page';
import {SharedModule} from '../../components/shared.module';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CreateLockerPage} from './create-locker/create-locker-page';
import {CommonModule} from '@angular/common';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              IonicModule,
              IonicPageModule.forChild(CellarPage),
              SharedModule,
              TranslateModule.forChild()
            ],
            declarations: [
              CellarPage
            ],
            entryComponents: [
              CellarPage
            ],
            exports: [
              CellarPage
            ],
            schemas: [
              CUSTOM_ELEMENTS_SCHEMA
            ]
          })
export class CellarPageModule {
}

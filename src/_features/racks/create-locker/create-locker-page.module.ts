import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CellarPage} from './cellar-page';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../components/shared.module';
import {CreateLockerPage} from './create-locker-page';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              IonicModule,
              SharedModule,
              TranslateModule.forChild()
            ],
            declarations: [
              CreateLockerPage
            ],
            entryComponents: [
              CreateLockerPage
            ],
            exports: [
              CreateLockerPage
            ],
            schemas: [
              CUSTOM_ELEMENTS_SCHEMA
            ]
          })
export class CreateLockerPageModule {
}

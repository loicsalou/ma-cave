import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RecordOutputPage} from './record-output';
import {CommonModule, NgSwitch} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../components/shared.module';

@NgModule({
            declarations: [
              RecordOutputPage
            ],
            imports: [
              FormsModule,
              CommonModule,
              IonicPageModule.forChild(RecordOutputPage),
              SharedModule
            ],
            exports: [ NgSwitch ],
            entryComponents: [
              RecordOutputPage ]
          })
export class RecordOutputPageModule {
}

import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import {AdminPage} from './admin-page';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {Camera} from '@ionic-native/camera';
import {FileChooser} from '@ionic-native/file-chooser';
import {CommonModule} from '@angular/common';
import {RecordOutputPage} from './record-output';
import {UpdatePage} from './update-page';
import {SharedModule} from '../../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              IonicPageModule.forChild(UpdatePage),
              TranslateModule.forChild()
            ],
            declarations: [
              UpdatePage
            ],
            entryComponents: [
              UpdatePage
            ],
            exports: [
              UpdatePage
            ],
            providers: [
              Transfer,
              TransferObject,
              FileChooser,
              Camera
            ]
          })
export class RecordOutputModule {
}

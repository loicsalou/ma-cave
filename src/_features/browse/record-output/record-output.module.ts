import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import {AdminPage} from './admin-page';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {Camera} from '@ionic-native/camera';
import {FilePath} from '@ionic-native/file-path';
import {File} from '@ionic-native/file';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {FileChooser} from '@ionic-native/file-chooser';
import {CommonModule} from '@angular/common';
import {RecordOutputPage} from './record-output';
import {SharedModule} from '../../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              IonicPageModule.forChild(RecordOutputPage),
              TranslateModule.forChild()
            ],
            declarations: [
              RecordOutputPage
            ],
            entryComponents: [
              RecordOutputPage
            ],
            exports: [
              RecordOutputPage
            ],
            providers: [
              Transfer,
              TransferObject,
              FileChooser,
              Camera,
              File,
              FilePath,
              BarcodeScanner
            ]
          })
export class RecordOutputModule {
}

import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../components/shared.module';
import {AdminPage} from './admin-page';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {FilePath} from '@ionic-native/file-path';
import {File} from '@ionic-native/file';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {FileChooser} from '@ionic-native/file-chooser';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ImportProvider} from '../../providers/import/import';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              IonicPageModule.forChild(AdminPage),
              TranslateModule.forChild()
            ],
            declarations: [
              AdminPage
            ],
            entryComponents: [
              AdminPage
            ],
            exports: [
              AdminPage
            ],
            providers: [
              Transfer,
              TransferObject,
              FileChooser,
              File,
              FilePath,
              ImportProvider,
              BarcodeScanner
            ]
          })
export class AdminPageModule {
}

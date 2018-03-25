import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UploadBottlesPage} from './upload-bottles.page';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {FileChooser} from '@ionic-native/file-chooser';
import {File} from '@ionic-native/file';
import {Camera} from '@ionic-native/camera';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {FilePath} from '@ionic-native/file-path';
import {SharedModule} from '../../components/shared.module';

@NgModule({
            declarations: [
              UploadBottlesPage
            ],
            imports: [
              IonicPageModule.forChild(UploadBottlesPage), SharedModule
            ],
            exports: [
              UploadBottlesPage
            ],
            providers: [
              Transfer, TransferObject, FileChooser, Camera, File, FilePath, BarcodeScanner
            ]
          })
export class UploadBottlesModule {
}

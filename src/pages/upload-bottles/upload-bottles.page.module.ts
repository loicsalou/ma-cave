import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UploadBottlesPage} from './upload-bottles.page';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {FileChooser} from '@ionic-native/file-chooser';
import {File} from '@ionic-native/file';
import {Camera} from '@ionic-native/camera';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {FilePath} from '@ionic-native/file-path';
import {HttpModule} from '@angular/http';
import {CavusService} from '../../service/cavus.service';

@NgModule({
            declarations: [
              UploadBottlesPage
            ],
            imports: [
              IonicPageModule.forChild(UploadBottlesPage), HttpModule
            ],
            exports: [
              UploadBottlesPage
            ],
            providers: [
              Transfer, TransferObject, FileChooser, Camera, File, FilePath, BarcodeScanner, CavusService
            ]
          })
export class UploadBottlesModule {
}

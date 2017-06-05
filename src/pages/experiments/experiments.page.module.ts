import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UploadBottlesPage} from './upload-bottles.page';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {Camera} from '@ionic-native/camera';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {HttpModule} from '@angular/http';
import {CavusService} from './cavus.service';
import {ExperimentsPage} from './experiments.page';

@NgModule({
            declarations: [
              ExperimentsPage
            ],
            imports: [
              IonicPageModule.forChild(ExperimentsPage), HttpModule
            ],
            exports: [
              ExperimentsPage
            ],
            providers: [
              Transfer, TransferObject, Camera, BarcodeScanner
            ]
          })
export class ExperimentsModule {
}

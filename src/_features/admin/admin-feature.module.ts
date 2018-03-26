import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ProfilePage} from './profile/profile';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../components/shared.module';
import {UploadBottlesPage} from './upload-bottles/upload-bottles.page';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {Camera} from '@ionic-native/camera';
import {FilePath} from '@ionic-native/file-path';
import {File} from '@ionic-native/file';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {FileChooser} from '@ionic-native/file-chooser';

@NgModule({
            imports: [
              BrowserModule,
              FormsModule,
              SharedModule,
              IonicPageModule.forChild(ProfilePage),
            ],
            declarations: [
              ProfilePage,
              UploadBottlesPage
            ],
            entryComponents: [
              ProfilePage,
              UploadBottlesPage
            ],
            exports: [
              ProfilePage,
              UploadBottlesPage
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
export class AdminFeatureModule {
}

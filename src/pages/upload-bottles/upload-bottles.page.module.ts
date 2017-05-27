import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {UploadBottlesPage} from "./upload-bottles.page";
import {Transfer, TransferObject} from "@ionic-native/transfer";
import {FileChooser} from "@ionic-native/file-chooser";

@NgModule({
            declarations: [
              UploadBottlesPage
            ],
            imports: [
              IonicPageModule.forChild(UploadBottlesPage)
            ],
            exports: [
              UploadBottlesPage
            ],
            providers: [
              Transfer, TransferObject, FileChooser
            ]
          })
export class UploadBottlesModule {
}

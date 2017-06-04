var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadBottlesPage } from './upload-bottles.page';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FilePath } from '@ionic-native/file-path';
import { HttpModule } from '@angular/http';
import { CavusService } from './cavus.service';
var UploadBottlesModule = (function () {
    function UploadBottlesModule() {
    }
    return UploadBottlesModule;
}());
UploadBottlesModule = __decorate([
    NgModule({
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
], UploadBottlesModule);
export { UploadBottlesModule };
//# sourceMappingURL=upload-bottles.page.module.js.map
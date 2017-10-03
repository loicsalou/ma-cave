import {NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {CellarPage} from './cellar.page';
import {TranslateModule} from '@ngx-translate/core';
import {SimpleLockerComponent} from '../../components/locker/simple-locker.component';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FridgeLockerComponent} from '../../components/locker/fridge-locker.component';
import {SharedModule} from '../../components/shared.module';
import {LockerEditorPage} from '../locker-editor/locker-editor.page';
import {LockerEditorPageModule} from '../locker-editor/locker-editor.page.module';
import {FormsModule} from '@angular/forms';
import {FirebaseConnectionService} from '../../service/firebase-connection.service';
import {LockerEditor2Page} from '../locker-editor2/locker-editor2.page';
import {LockerEditor2PageModule} from '../locker-editor2/locker-editor2.page.module';
import {RecordOutputPageModule} from '../record-output/record-output.module';
import {RecordOutputPage} from '../record-output/record-output';

@NgModule({
            declarations: [
              CellarPage
            ],
            imports: [
              BrowserModule,
              CommonModule,
              FormsModule,
              IonicModule,
              IonicPageModule.forChild(CellarPage),
              LockerEditorPageModule,
              LockerEditor2PageModule,
              RecordOutputPageModule,
              SharedModule
            ],
            exports: [
              CellarPage,
              LockerEditorPage,
              LockerEditor2Page,
              SimpleLockerComponent,
              FridgeLockerComponent
            ],
            providers: [
              CellarPersistenceService,
              FirebaseConnectionService
            ],
            entryComponents: [
              LockerEditorPage,
              LockerEditor2Page,
              RecordOutputPage
            ]
          })
export class CellarPageModule {
}

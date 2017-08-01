import {NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {CellarPage} from './cellar.page';
import {TranslateModule} from '@ngx-translate/core';
import {LockerComponent} from '../../components/locker/locker.component';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FridgeLockerComponent} from '../../components/locker/fridge-locker.component';
import {SharedModule} from '../../components/shared.module';
import {LockerEditorPage} from '../locker-editor/locker-editor.page';
import {LockerEditorPageModule} from '../locker-editor/locker-editor.page.module';
import {FormsModule} from '@angular/forms';
import {FirebaseConnectionService} from '../../service/firebase-connection.service';

@NgModule({
            declarations: [
              CellarPage,
              LockerComponent,
              FridgeLockerComponent
            ],
            imports: [
              BrowserModule,
              CommonModule,
              FormsModule,
              IonicModule,
              IonicPageModule.forChild(CellarPage),
              LockerEditorPageModule,
              SharedModule,
              TranslateModule
            ],
            exports: [
              CellarPage,
              LockerComponent,
              LockerEditorPage,
              FridgeLockerComponent
            ],
            providers: [
              CellarPersistenceService,
              FirebaseConnectionService
            ],
            entryComponents: [
              LockerEditorPage
            ]
          })
export class CellarPageModule {
}

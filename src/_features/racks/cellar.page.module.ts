import {NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {CellarPage} from './cellar/cellar.page';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../../components/shared.module';
import {FormsModule} from '@angular/forms';
import {FirebaseConnectionService} from '../../service/firebase-connection.service';
import {TranslateModule} from '@ngx-translate/core';
import {UpdateLockerPage} from './update-locker/update-locker.page';
import {CreateLockerPage} from './create-locker/create-locker.page';

@NgModule({
            declarations: [
              CellarPage,
              CreateLockerPage,
              UpdateLockerPage
            ],
            imports: [
              BrowserModule,
              CommonModule,
              FormsModule,
              IonicModule,
              IonicPageModule.forChild(CellarPage),
              SharedModule,
              TranslateModule.forChild()
            ],
            exports: [
              CellarPage,
              CreateLockerPage,
              UpdateLockerPage,
            ],
            providers: [
              CellarPersistenceService,
              FirebaseConnectionService
            ],
            entryComponents: [
              CreateLockerPage,
              UpdateLockerPage
            ]
          })
export class CellarPageModule {
}

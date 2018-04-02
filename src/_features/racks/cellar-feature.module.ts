import {NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {CellarPage} from './cellar/cellar.page';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../../components/shared.module';
import {FormsModule} from '@angular/forms';
import {FirebaseAdminService} from '../../service/firebase/firebase-admin.service';
import {TranslateModule} from '@ngx-translate/core';
import {UpdateLockerPage} from './update-locker/update-locker.page';
import {CreateLockerPage} from './create-locker/create-locker.page';
import {FirebaseLockersService} from '../../service/firebase/firebase-lockers.service';

@NgModule({
            imports: [
              BrowserModule,
              FormsModule,
              IonicModule,
              IonicPageModule.forChild(CellarPage),
              SharedModule,
              TranslateModule.forChild()
            ],
            declarations: [
              CellarPage,
              CreateLockerPage,
              UpdateLockerPage
            ],
            entryComponents: [
              CreateLockerPage,
              UpdateLockerPage
            ],
            exports: [
              CellarPage,
              CreateLockerPage,
              UpdateLockerPage,
            ],
            providers: [
              CellarPersistenceService
            ]
          })
export class CellarFeatureModule {
}

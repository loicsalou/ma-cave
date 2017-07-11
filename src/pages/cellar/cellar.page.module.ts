import {NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {CellarPage} from './cellar.page';
import {TranslateModule} from '@ngx-translate/core';
import {LockerComponent} from '../../components/locker/locker.component';
import {MockCellarService} from '../../service/mock/mock-cellar.service';
import {FirebaseCellarService} from '../../service/firebase-cellar.service';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FridgeLockerComponent} from '../../components/locker/fridge-locker.component';

@NgModule({
            declarations: [
              CellarPage,
              LockerComponent,
              FridgeLockerComponent
            ],
            imports: [
              BrowserModule,
              CommonModule,
              IonicModule,
              IonicPageModule.forChild(CellarPage),
              TranslateModule
            ],
            exports: [
              CellarPage,
              LockerComponent,
              FridgeLockerComponent
            ],
            providers: [
              {provide: FirebaseCellarService, useClass: MockCellarService}
            ]
          })
export class CellarPageModule {
}

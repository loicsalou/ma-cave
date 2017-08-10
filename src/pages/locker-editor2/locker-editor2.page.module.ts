import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LockerEditor2Page } from './locker-editor2.page';
import {TranslateModule} from '@ngx-translate/core';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {SimpleLockerComponent} from '../../components/locker/simple-locker.component';
import {FridgeLockerComponent} from '../../components/locker/fridge-locker.component';

@NgModule({
  declarations: [
    LockerEditor2Page,
    SimpleLockerComponent,
    FridgeLockerComponent
  ],
  imports: [
    IonicModule,
    TranslateModule
  ],
  exports: [
    LockerEditor2Page,
    SimpleLockerComponent,
    FridgeLockerComponent
  ]
})
export class LockerEditor2PageModule {}

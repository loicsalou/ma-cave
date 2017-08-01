import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LockerEditorPage } from './locker-editor.page';
import {TranslateModule} from '@ngx-translate/core';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';

@NgModule({
  declarations: [
    LockerEditorPage
  ],
  imports: [
    IonicModule,
    TranslateModule
  ],
  exports: [
    LockerEditorPage
  ]
})
export class LockerEditorPageModule {}

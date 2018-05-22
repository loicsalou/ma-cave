import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import {AdminPage} from './admin-page';
import {Camera} from '@ionic-native/camera';
import {CommonModule} from '@angular/common';
import {RecordOutputPage} from './record-output';
import {UpdatePage} from './update-page';
import {SharedModule} from '../../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {ImageAttacherComponent} from '../../../components/image-attacher/image-attacher';
import {ImagePersistenceService} from '../../../service/image-persistence.service';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              IonicPageModule.forChild(UpdatePage),
              TranslateModule.forChild()
            ],
            declarations: [
              ImageAttacherComponent,
              UpdatePage
            ],
            entryComponents: [
              UpdatePage
            ],
            exports: [
              ImageAttacherComponent,
              UpdatePage
            ],
            providers: [
              ImagePersistenceService,
              Camera
            ]
          })
export class RecordOutputModule {
}

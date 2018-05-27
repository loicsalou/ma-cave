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
import {CordovaImageAttacherComponent} from '../../../components/image-attacher-cordova/cordova-image-attacher';
import {ImagePersistenceService} from '../../../service/image-persistence.service';
import {PwaImageAttacherComponent} from '../../../components/image-attacher-pwa/pwa-image-attacher';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              IonicPageModule.forChild(UpdatePage),
              TranslateModule.forChild()
            ],
            declarations: [
              CordovaImageAttacherComponent,
              PwaImageAttacherComponent,
              UpdatePage
            ],
            entryComponents: [
              UpdatePage
            ],
            exports: [
              CordovaImageAttacherComponent,
              PwaImageAttacherComponent,
              UpdatePage
            ],
            providers: [
              ImagePersistenceService,
              Camera
            ]
          })
export class RecordOutputModule {
}

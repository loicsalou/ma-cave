import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AdminPage} from './admin-page';
import {CommonModule} from '@angular/common';
import {RecordOutputPage} from './record-output';
import {UpdatePage} from './update-page';
import {SharedModule} from '../../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {ImagePersistenceService} from '../../../service/image-persistence.service';
import {PwaImageAttacherComponent} from '../../../components/image-attacher-pwa/pwa-image-attacher';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              TranslateModule.forChild()
            ],
            declarations: [
              PwaImageAttacherComponent,
              UpdatePage
            ],
            entryComponents: [
              UpdatePage
            ],
            exports: [
              PwaImageAttacherComponent,
              UpdatePage
            ],
            providers: [
              ImagePersistenceService
            ]
          })
export class RecordOutputModule {
}

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AdminPage} from './admin-page';
import {CommonModule} from '@angular/common';
import {RecordOutputPage} from './record-output';
import {SharedModule} from '../../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              TranslateModule.forChild()
            ],
            declarations: [
              RecordOutputPage
            ],
            entryComponents: [
              RecordOutputPage
            ],
            exports: [
              RecordOutputPage
            ]
          })
export class RecordOutputModule {
}

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../components/shared.module';
import {AdminPage} from './admin-page';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ImportProvider} from '../../providers/import/import';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              TranslateModule.forChild()
            ],
            declarations: [
              AdminPage
            ],
            entryComponents: [
              AdminPage
            ],
            exports: [
              AdminPage
            ],
            providers: [
              ImportProvider
            ]
          })
export class AdminPageModule {
}

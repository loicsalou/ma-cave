import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProfilePage} from './profile';
import {SharedModule} from '../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              TranslateModule.forChild()
            ],
            declarations: [
              ProfilePage
            ],
            entryComponents: [
              ProfilePage
            ],
            exports: [
              ProfilePage
            ]
          })
export class ProfileModule {
}

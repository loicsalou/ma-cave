import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AdminPage} from './admin-page';
import {CommonModule} from '@angular/common';
import {RecordOutputPage} from './record-output';
import {SharedModule} from '../../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {BrowsePage} from './browse-page';
import {FilterPage} from '../filters/filter.page';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              TranslateModule.forChild()
            ],
            declarations: [
              BrowsePage,
              FilterPage
            ],
            entryComponents: [
              BrowsePage,
              FilterPage
            ],
            exports: [
              BrowsePage,
              FilterPage
            ],
            providers: []
          })
export class BrowsePageModule {
}

import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import {AdminPage} from './admin-page';
import {CommonModule} from '@angular/common';
import {RecordOutputPage} from './record-output';
import {TranslateModule} from '@ngx-translate/core';
import {BrowsePage} from './browse-page';
import {BottleDetailPage} from './bottle-detail-page';
import {SlideBottleDetail} from './slide-bottle-detail';
import {SharedModule} from '../../../components/shared.module';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              IonicPageModule.forChild(BottleDetailPage),
              TranslateModule.forChild()
            ],
            declarations: [
              BottleDetailPage,
              SlideBottleDetail
            ],
            entryComponents: [
              BottleDetailPage
            ],
            exports: [
              BottleDetailPage,
              SlideBottleDetail
            ],
            providers: []
          })
export class BottleDetailPageModule {
}

import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {DefaultImageDirective} from './default-image/default-image';
import {BrowsePage} from './browse.page';
import {BrowserModule} from '@angular/platform-browser';
import {BottleDetailPage} from './page-bottle-detail';
import {BottleDetailSlide} from './slide-bottle-detail';
import {UpdatePage} from '../update/update.page';
import {SharedModule} from '../../components/shared.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
            declarations: [
              BottleDetailPage,
              BottleDetailSlide,
              UpdatePage
            ],
            imports: [
              IonicModule,
              BrowserModule,
              SharedModule,
              TranslateModule
            ],
            exports: [
              BottleDetailPage,
              BottleDetailSlide,
              UpdatePage
            ]
          })
export class BottleDetailModule {
}

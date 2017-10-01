import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RecordOutputPage} from './record-output';
import {RatingComponent} from '../../components/rating/rating';

@NgModule({
            declarations: [
              RecordOutputPage,
            ],
            imports: [
              IonicPageModule.forChild(RecordOutputPage),
              RatingComponent
            ],
          })
export class RecordOutputPageModule {
}

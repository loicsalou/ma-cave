import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TestPage} from './test';

@NgModule({
            declarations: [
              TestPage,
            ],
            imports: [
              IonicPageModule.forChild(TestPage),
            ],
            entryComponents: [
              TestPage
            ]
          })
export class TestPageModule {
}

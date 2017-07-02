import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {ImageAttacherComponent} from './image-attacher';
import {ProgressBarComponentModule} from '../progress-bar/progress-bar.module';

@NgModule({
            declarations: [
              ImageAttacherComponent,
            ],
            imports: [
              IonicModule,
              ProgressBarComponentModule
            ],
            exports: [
              ImageAttacherComponent
            ]
          })
export class ImageAttacherComponentModule {
}

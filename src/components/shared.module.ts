import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {DefaultImageDirective} from '../directives/default-image/default-image';
import {BottleIconPipe} from './list/bottle-item-component/bottle-icon.pipe';
import {ImageAttacherComponent} from './image-attacher/image-attacher';
import {ProgressBarComponent} from './progress-bar/progress-bar';

@NgModule({
            declarations: [
              DefaultImageDirective,
              BottleIconPipe,
              ImageAttacherComponent,
              ProgressBarComponent
            ],
            imports: [
              IonicModule
            ],
            exports: [
              DefaultImageDirective,
              BottleIconPipe,
              ImageAttacherComponent,
              ProgressBarComponent
            ]
          })
export class SharedModule {
}

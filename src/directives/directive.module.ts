import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {DefaultImageDirective} from './default-image/default-image';

@NgModule({
            declarations: [
              DefaultImageDirective,
            ],
            imports: [
              IonicModule
            ],
            exports: [
              DefaultImageDirective,
            ]
          })
export class DirectiveModule {
}

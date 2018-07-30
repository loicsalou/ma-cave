import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import {TranslateModule} from '@ngx-translate/core';
import {PopoverPage} from './popover-page';
import {CommonModule} from '@angular/common';
import {CameraPopoverPage} from './camera-popover.page';

@NgModule({
            imports: [
              IonicModule,
              IonicPageModule.forChild(CameraPopoverPage),
              CommonModule,
              TranslateModule
            ],
            declarations: [
              CameraPopoverPage
            ],
            entryComponents: [
              CameraPopoverPage
            ],
            exports: [
              CameraPopoverPage
            ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
          })
export class CameraPopoverPageModule {
}

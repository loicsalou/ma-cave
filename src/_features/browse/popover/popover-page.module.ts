import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {PopoverPage} from './popover-page';
import {CommonModule} from '@angular/common';

@NgModule({
            imports: [
              IonicModule,
              CommonModule,
              TranslateModule
            ],
            declarations: [
              PopoverPage
            ],
            entryComponents: [
              PopoverPage
            ],
            exports: [
              PopoverPage
            ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
          })
export class PopoverPageModule {
}

import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResponsiveWrapperComponent} from './responsive-wrapper/responsive-wrapper';
import {RackDirective} from './rack.directive';

@NgModule({
            imports: [
              CommonModule
            ],
            declarations: [
              ResponsiveWrapperComponent
            ],
            exports: [
              ResponsiveWrapperComponent
            ],
            schemas: [
              NO_ERRORS_SCHEMA
            ]
          })
export class SharedCoreModule {
}

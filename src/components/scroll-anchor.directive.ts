import {Directive, ElementRef, Input} from '@angular/core';
import {logDebug} from '../utils';

@Directive({
             selector: '[scrollAnchor]', // Attribute selector
             host: {
               '(error)': 'trace($event.target)'
             }
           })
export class ScrollAnchorDirective {

  @Input() scrollAnchor: string;

  constructor(public ref: ElementRef) {
  }

  trace(eventTarget: any) {
    logDebug(eventTarget);
  }
}

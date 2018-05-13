import {AfterViewInit, Directive, ElementRef, Host, Input, Self} from '@angular/core';
import {Dimension} from '../model/locker';

@Directive({
             selector: '[zoomable]'
           })
export class ZoomableDirective implements AfterViewInit {

  @Input() zoomable = true;

  constructor(@Host() @Self() private ref: ElementRef) {
  }

  get zoomableComponent(): any {
    return this.ref.nativeElement;
  }

  ngAfterViewInit(): void {
  }

}

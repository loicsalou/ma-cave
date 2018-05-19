import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {Dimension} from '../model/locker';

@Directive({
             selector: '[dimensionOf]'
           })
export class DimensionOfDirective<T> implements AfterViewInit {

  @Input() dimensionOf: T;
  width: number | undefined;
  height: number | undefined;

  constructor(private ref: ElementRef) {
  }

  ngAfterViewInit(): void {
    const native = this.ref.nativeElement;
    if (native) {
      this.width = native[ 'clientWidth' ];
      this.height = native[ 'clientHeight' ];
    }
  }

  getContainerSize(): Dimension {
    return {
      x: this.width,
      y: this.height
    };
  }
}

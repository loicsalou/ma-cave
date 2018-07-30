import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {LockerDimension} from '../model/locker-dimension';

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
    const nativeElement = this.ref.nativeElement;
    if (nativeElement) {
      this.width = nativeElement[ 'clientWidth' ];
      this.height = nativeElement[ 'clientHeight' ];
    }
  }

  getContainerSize(): LockerDimension {
    return {
      x: this.width,
      y: this.height
    };
  }
}

import {Component, Input} from '@angular/core';
import {Bottle} from '../../model/bottle';

@Component({
             selector: 'bottle-icon',
             templateUrl: 'bottle-icon.component.html'
           }
)
export class BottleIconComponent {
  @Input()
  selected = false;
  @Input()
  favorite = false;
  @Input()
  bottle: Bottle;
  @Input()
  maxWidth: number;
  @Input()
  maxHeight: number;
}

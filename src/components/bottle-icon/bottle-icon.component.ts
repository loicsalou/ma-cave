import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  selectable = false;
  @Input()
  favorite = false;
  @Input()
  bottle: Bottle;
  @Input()
  maxWidth: number;
  @Input()
  maxHeight: number;

  @Output()
  onSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

  setSelected(event) {
    this.selected = event.checked;
    this.onSelect.emit(this.selected);
  }
}

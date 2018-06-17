import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bottle} from '../../model/bottle';

/**
 * Generated class for the BottleActionComponent component.
 */
@Component({
             selector: 'bottle-action',
             templateUrl: 'bottle-action.html'
           })
export class BottleActionComponent {

  @Input() bottle: Bottle;
  @Input() isFavorite = false;
  @Output() locate: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() favorite: EventEmitter<MouseEvent> = new EventEmitter();

  locateBottle(event: MouseEvent) {
    this.locate.emit(event);
  }

  favoriteBottle(event: MouseEvent) {
    this.favorite.emit(event);
  }

}

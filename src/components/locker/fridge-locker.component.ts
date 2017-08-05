import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FridgeLocker} from '../../model/fridge-locker';
import {Cell, LockerComponent} from './locker.component';
import {Bottle} from '../../model/bottle';
import {NotificationService} from '../../service/notification.service';

/**
 * Generated class for the CompositeLockerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'fridge-locker',
             templateUrl: './fridge-locker.component.html',
             styleUrls: [ '/fridge-locker.component.scss' ]
           })
export class FridgeLockerComponent implements OnInit {

  //racks composant le frigo, càd npmbre de rangées
  //chaque rangée est en fait un locker ayant ses propres dimensions l x L
  //Celles-ci n'ont pas forcément toutes la même hauteur, ex dans un frigo, les étagères permettent de créer des
  // racks de différentes hauteurs
  @Input()
  fridge: FridgeLocker;

  @Input()
  content: Bottle[] = [];

  @Input()
  highlighted: Bottle[];

  @Output()
  selected: EventEmitter<Cell> = new EventEmitter<Cell>();

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  sizeClass(): string {
    return LockerComponent.SIZE_CLASSES[ this.fridge.currentSize ];
  }

  cellSelected(cell: Cell) {
    if (cell) {
      this.selected.emit(cell);
    }
  }

}

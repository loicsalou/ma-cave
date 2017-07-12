import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FridgeLocker} from '../../model/fridge-locker';
import {Cell} from './locker.component';

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
  //Celles-ci n'ont pas forcément toutes la même hauteur, ex dans un frigo, en bas on peut mettre 4 rangs, en haut
  // seulement 2
  @Input()
  fridge: FridgeLocker;

  @Output()
  selected: EventEmitter<Cell> = new EventEmitter<Cell>();

  constructor() {
  }

  ngOnInit(): void {
  }

  cellSelected(cell: Cell) {
    if (cell) {
      this.selected.emit(cell);
    }
  }

}

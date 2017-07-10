import {Component, Input, OnInit} from '@angular/core';
import {Locker} from '../../model/locker';
import * as _ from 'lodash';

/**
 * Generated class for the LockerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'locker',
             templateUrl: './locker.component.html',
             styleUrls: [ '/locker.component.scss' ]
           })
export class LockerComponent implements OnInit {

  @Input()
  locker: Locker;

  rows: Row[];

  constructor() {
  }

  ngOnChanges(changes: any) {
    this.resetComponent();
  }

  private resetComponent() {
    let cell = new Cell();
    let cells = new Array<Cell>(this.locker.dimensions.x);
    _.fill(cells, cell);
    let row = new Row(cells);
    this.rows = new Array<Row>(this.locker.dimensions.y);
    _.fill(this.rows, row);
  }

  ngOnInit(): void {
    if (this.locker.dimensions && !this.rows) {
      this.resetComponent();
    }
  }

  cellClicked(cell: Cell) {
    console.info(cell);
  }

}

class Row {

  constructor(cells: Cell[]) {
    this.cells = cells;
  }

  cells: Cell[];
}

class Cell {

}

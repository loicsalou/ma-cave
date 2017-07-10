import {Component, Input, OnInit} from '@angular/core';
import {Locker} from '../../model/locker';
import * as _ from 'lodash';
import {Configuration} from '../config/Configuration';

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
  private static COLORS = [ 'rouge',
    'blanc',
    'blanc effervescent',
    'cognac',
    'demi-sec',
    'rosé effervescent',
    'rosé',
    'vin jaune',
    'vin blanc muté',
    'blanc moëlleux',
    'vin de paille',
    'blanc liquoreux' ];

  @Input()
  locker: Locker;

  rows: Row[];

  constructor() {
  }

  ngOnChanges(changes: any) {
    this.resetComponent();
  }

  label() {
    let ix = Math.round(Math.random() * 11 );
    return LockerComponent.COLORS[ ix ];
  }

  private resetComponent() {
    this.rows=[];
    for (let i=0; i<this.locker.dimensions.y; i++) {
      this.rows[i]=this.initRow(this.locker.dimensions.x);
    }
  }

  private initRow(nbcells: number): Row {
    let cells: Cell[]=[];
    for (let i=0; i<nbcells; i++) {
      cells[i]=new Cell(this.label());
    }
    return new Row(cells);
  }

  private initCell(): Cell {
    return new Cell(this.label());
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
  cellClass: string;

  constructor(color: string) {
    this.cellClass = Configuration.colorsText2Code[ color.toLowerCase() ];
  }
}

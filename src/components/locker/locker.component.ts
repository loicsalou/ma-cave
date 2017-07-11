import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SimpleLocker} from '../../model/simple-locker';
import {Configuration} from '../config/Configuration';
import {LockerType} from '../../model/locker';

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
  locker: SimpleLocker;
  rows: Row[];

  @Output()
  selected: EventEmitter<Cell> = new EventEmitter<Cell>();

  constructor() {
  }

  ngOnInit(): void {
    if (this.locker.dimension && !this.rows) {
      this.resetComponent();
    }
  }

  ngOnChanges(changes: any) {
    this.resetComponent();
  }

  isShifted(): boolean {
    return this.locker.type == LockerType.shifted
  }

  isDiamond(): boolean {
    return this.locker.type == LockerType.diamond
  }

  isSimple(): boolean {
    return this.locker.type == LockerType.simple
  }

  cellSelected(cell: Cell) {
    if (cell) {
      cell.switchSelected();
      this.selected.emit(cell);
    }
  }

  label() {
    let ix = Math.round(Math.random() * 12);
    if (ix > LockerComponent.COLORS.length) {
      return undefined; // emplacement vide
    } else {
      return LockerComponent.COLORS[ ix ];
    }
  }

  private resetComponent() {
    this.rows = [];
    for (let i = 0; i < this.locker.dimension.y; i++) {
      this.rows[ i ] = this.initRow(this.locker.dimension.x);
    }
  }

  private initRow(nbcells: number): Row {
    let cells: Cell[] = [];
    for (let i = 0; i < nbcells; i++) {
      cells[ i ] = new Cell(this.label());
    }
    return new Row(cells);
  }

  private initCell(): Cell {
    return new Cell(this.label());
  }
}

class Row {

  constructor(cells: Cell[]) {
    this.cells = cells;
  }

  cells: Cell[];
}

export class Cell {
  cellClass: string;
  empty: boolean = true;
  selected = false;

  constructor(color: string) {
    if (color) {
      this.empty = false;
      this.cellClass = Configuration.colorsText2Code[ color.toLowerCase() ];
    } else {
      this.cellClass = 'empty';
    }
  }

  switchSelected() {
    if (this.empty) {
      return;
    }
    this.selected = !this.selected;
    if (this.selected) {
      this.cellClass += ' selected';
    } else {
      this.cellClass = this.cellClass.replace('selected', '').trim();
    }
  }
}

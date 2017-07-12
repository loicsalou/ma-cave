import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SimpleLocker} from '../../model/simple-locker';
import {Configuration} from '../config/Configuration';
import {LockerType} from '../../model/locker';
import {Bottle} from '../../model/bottle';

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
      this.selected.emit(cell);
    }
  }

  mockBottle() {
    let label = undefined;
    let ix = Math.round(Math.random() * 12);
    if (ix < LockerComponent.COLORS.length) {
      label = LockerComponent.COLORS[ ix ];
    } else {
      return undefined;
    }
    let bottle = new Bottle();
    bottle.label = label;
    bottle.area_label = 'area_label';
    bottle.subregion_label = 'subregion_label';
    bottle.nomCru = 'nomCru';
    bottle.quantite_courante = 1;
    return bottle;
  }

  private resetComponent() {
    this.rows = [];
    for (let i = 0; i < this.locker.dimension.y; i++) {
      this.rows[ i ] = this.initRow(this.locker.dimension.x, i);
    }
  }

  private initRow(nbcells: number, rowNumber: number): Row {
    let cells: Cell[] = [];
    let rowId = this.locker.name + '-' + rowNumber;
    for (let i = 0; i < nbcells; i++) {
      cells[ i ] = new Cell(this.mockBottle(), rowId + '-' + i);
    }
    return new Row(cells, rowId);
  }
}

class Row {

  private id: string;
  cells: Cell[];

  constructor(cells: Cell[], id: string) {
    this.cells = cells;
    this.id = id;
  }

}

export class Cell {
  id: string;
  bottle: Bottle;
  cellClass: string;
  selected = false;

  constructor(bottle: Bottle, id: string) {
    this.id = id;
    this.storeBottle(bottle);
  }

  public isEmpty(): boolean {
    return this.bottle === undefined;
  }

  public withdraw(): any {
    let btl = this.bottle;
    this.bottle = undefined;
    this.cellClass = 'empty';
    return btl;
  }

  public storeBottle(bottle: Bottle) {
    this.bottle = bottle;
    if (this.isEmpty()) {
      this.cellClass = 'empty';
    } else {
      if (bottle.label === undefined) {
        console.info();
      } else {
        this.cellClass = Configuration.colorsText2Code[ bottle.label.toLowerCase() ];
      }
    }
  }

  /**
   * cellule cliquée ==> remonter l'information jusqu'à la page pour qu'une éventuelle bouteille en transit soit
   * affectée à la cellule cliquée
   */
  setSelected(selected: boolean) {
    this.selected = selected;
    if (this.selected) {
      this.cellClass += ' selected';
    } else {
      this.cellClass = this.cellClass.replace('selected', '').trim();
    }
  }
}

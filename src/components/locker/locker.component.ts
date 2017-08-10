import {EventEmitter, Input, Output} from '@angular/core';
import {Configuration} from '../config/Configuration';
import {Bottle, Position} from '../../model/bottle';

export abstract class LockerComponent {

  protected static SIZE_CLASSES = [ 'small', 'medium', 'big', 'huge' ];

  @Input()
  size: LockerSize = undefined;

  @Input()
  content: Bottle[] = [];

  @Input()
  highlighted: Bottle[];

  @Output()
  selected: EventEmitter<Cell> = new EventEmitter<Cell>();


  constructor() {
  }

  /**
   * refreshes component after an update has been made
   */
  public abstract resetComponent();

  sizeClass(): string {
    if (this.size !== undefined) {
      return LockerComponent.SIZE_CLASSES[ this.size ];
    }
    return LockerComponent.SIZE_CLASSES[ LockerSize.medium ];
  }
}

export class Row {

  private id: string;
  index: number;
  cells: Cell[];

  constructor(cells: Cell[], rowIndex: number) {
    this.cells = cells;
    this.index = rowIndex;
  }

}

export class Cell {
  bottle: Bottle;
  cellClass: string;
  selected = false;
  position: Position;

  constructor(position: Position) {
    this.position = position;
  }

  public isEmpty(): boolean {
    return this.bottle === undefined;
  }

  public withdraw(): Bottle {
    let btl = this.bottle;
    this.bottle = undefined;
    this.cellClass = 'empty';
    if (this.selected) {
      this.cellClass += ' selected';
    }
    return btl;
  }

  public storeBottle(bottle: Bottle, highlight = false) {
    if (!bottle) {
      return;
    }

    this.bottle = bottle;
    if (this.isEmpty()) {
      this.cellClass = 'empty';
    } else {
      this.cellClass = Configuration.colorsText2Code[ bottle.label.toLowerCase() ];
    }
    if (highlight) {
      this.cellClass += ' highlighted'
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

export enum LockerSize {
  small, medium, big, huge
}

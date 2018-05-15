import {Bottle, Position} from '../../model/bottle';

export class Cell {
  bottle: Bottle;
  cellClass: string;
  selected = false;
  position: Position;

  constructor(position: Position, private config: any) {
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
      this.cellClass = this.config.colorsText2Code[ bottle.label ? bottle.label.toLowerCase() : '' ];
    }
    if (highlight) {
      this.cellClass += ' highlighted';
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

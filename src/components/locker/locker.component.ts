import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SimpleLocker} from '../../model/simple-locker';
import {Configuration} from '../config/Configuration';
import {LockerType} from '../../model/locker';
import {Bottle, Position} from '../../model/bottle';
import {NotificationService} from '../../service/notification.service';

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
  //private static COLORS = [ 'rouge',
  //  'blanc',
  //  'blanc effervescent',
  //  'cognac',
  //  'demi-sec',
  //  'rosé effervescent',
  //  'rosé',
  //  'vin jaune',
  //  'vin blanc muté',
  //  'blanc moëlleux',
  //  'vin de paille',
  //  'blanc liquoreux' ];

  public static SIZE_CLASSES = [ 'small', 'medium', 'big', 'huge' ];

  @Input()
  locker: SimpleLocker;

  @Input()
  content: Bottle[] = [];

  @Output()
  selected: EventEmitter<Cell> = new EventEmitter<Cell>();

  rows: Row[];
  private bogusBottles = [];

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    if (this.locker.dimension && !this.rows) {
      this.resetComponent();
    }
    this.content.forEach(
      bottle => {
        if (bottle.positions) {
          bottle.positions.filter(position => position.lockerId === this.locker.id)
            .forEach(position => this.placeBottle(bottle, position))
        }
      });
    if (this.bogusBottles.length > 0) {
      this.notificationService.ask('Position inexistante', this.bogusBottles.length + ' bouteilles sont dans une position' +
        ' inexistante: les remettre en attente de rangement ?')
        .subscribe(
          result => {
            if (result) {
              this.notificationService.information('SUPPRESSION DES POSITIONS ERRONEES A IMPLEMENTER')
              //this.bogusBottles.forEach(btl => btl.positions = btl.positions.filter(
              //  pos => !(pos.lockerId = position.lockerId && pos.x === position.x && pos.y === position.y)))
            }
          })
    }

  }

  ngOnChanges(changes: any) {
    this.resetComponent();
  }

  sizeClass(): string {
    return LockerComponent.SIZE_CLASSES[ this.locker.currentSize ];
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

  isFridge(): boolean {
    return this.locker.type == LockerType.fridge
  }

  cellSelected(cell: Cell) {
    if (cell) {
      this.selected.emit(cell);
    }
  }

  //private static mockBottle() {
  //  let label = undefined;
  //  let ix = Math.round(Math.random() * 12);
  //  if (ix < LockerComponent.COLORS.length) {
  //    label = LockerComponent.COLORS[ ix ];
  //  } else {
  //    return undefined;
  //  }
  //  let bottle = new Bottle();
  //  bottle.label = label;
  //  bottle.area_label = 'area_label';
  //  bottle.subregion_label = 'subregion_label';
  //  bottle.nomCru = 'Domaine Marcel Deiss - Burlenberg';
  //  bottle.millesime = '2010';
  //  bottle.quantite_courante = 1;
  //  return bottle;
  //}

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
      cells[ i ] = new Cell(undefined, rowId + '-' + i);
    }
    return new Row(cells, rowId);
  }

  private placeBottle(bottle: Bottle, position: Position) {
    this.bogusBottles = []
    if (this.rows.length < position.y || this.rows[ position.y ].cells.length < position.y) {
      this.bogusBottles.push(bottle);
    } else {
      this.rows[ position.y ].cells[ position.x ].storeBottle(bottle);
    }
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
    if (this.selected) {
      this.cellClass += ' selected';
    }
    return btl;
  }

  public storeBottle(bottle: Bottle) {
    if (!bottle) {
      return;
    }

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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SimpleLocker} from '../../model/simple-locker';
import {LockerType} from '../../model/locker';
import {Bottle, Position} from '../../model/bottle';
import {NotificationService} from '../../service/notification.service';
import {Cell, Row, LockerComponent} from './locker.component';

/**
 * Generated class for the SimpleLockerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'locker',
             templateUrl: './simple-locker.component.html',
             styleUrls: [ '/locker.component.scss' ]
           })
export class SimpleLockerComponent extends LockerComponent implements OnInit {

  @Input()
  locker: SimpleLocker;

  @Input()
  rack: number = 0;

  rows: Row[];
  private bogusBottles = [];

  constructor(private notificationService: NotificationService) {
    super()
  }

  ngOnInit(): void {
    if (this.locker.dimension && !this.rows) {
      this.resetComponent();
    }
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

  public resetComponent() {
    this.rows = [];
    for (let i = 0; i < this.locker.dimension.y; i++) {
      this.rows[ i ] = this.initRow(this.locker.dimension.x, i);
    }
    this.content.forEach(
      bottle => {
        if (bottle.positions) {
          bottle.positions.filter(
            position => position.inRack(this.locker.id, this.rack)
          ).forEach(
            position => this.placeBottle(bottle, position)
          )
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

  private initRow(nbcells: number, rowIndex: number): Row {
    let cells: Cell[] = [];
    //let rowId = this.locker.name + '-' + rowIndex;
    for (let i = 0; i < nbcells; i++) {
      let position = new Position(this.locker.id, i, rowIndex, this.rack);
      cells[ i ] = new Cell(position);
    }
    //return new Row(cells, rowId, rowIndex);
    return new Row(cells, rowIndex);
  }

  public placeBottle(bottle: Bottle, position: Position) {
    this.bogusBottles = [];
    if (this.rows.length < position.y || this.rows[ position.y ].cells.length < position.x) {
      this.bogusBottles.push(bottle);
    } else {
      let targetCell = this.rows[ position.y ].cells[ position.x ];
      targetCell.storeBottle(bottle, this.isHighlighted(bottle));
      //bottle.addNewPosition(targetCell.position);
    }
  }

  isHighlighted(bottle: Bottle): boolean {
    if (!this.highlighted) {
      return false;
    }
    return this.highlighted.find(btl => btl.id === bottle.id) !== undefined;
  }
}

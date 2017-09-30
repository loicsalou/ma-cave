import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {SimpleLocker} from '../../model/simple-locker';
import {Dimension, LockerType} from '../../model/locker';
import {Bottle, Position} from '../../model/bottle';
import {NotificationService} from '../../service/notification.service';
import {Cell, LockerComponent, Row} from './locker.component';
import {Gesture} from 'ionic-angular';
import {NativeProvider} from '../../providers/native/native';

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
export class SimpleLockerComponent extends LockerComponent implements OnInit, AfterViewInit {
  protected static MAX_NB_COLUMNS: number = 16;
  protected static MIN_NB_COLUMNS: number = 1;
  protected static MAX_NB_ROWS: number = 16;
  protected static MIN_NB_ROWS: number = 1;

  @Input()
  locker: SimpleLocker;

  @Input()
  rack: number = 0;

  rows: Row[];
  private bogusBottles = [];

  constructor(private notificationService: NotificationService, nativeProvider: NativeProvider) {
    super(nativeProvider)
  }

  ngOnInit(): void {
    if (this.locker.dimension && !this.rows) {
      this.resetComponent();
    }
  }

  get dimension(): Dimension {
    return this.locker.dimension
  }

  /**
   * renvoie les bouteilles de la rangée qui contient la cellule
   * @param {Cell} cell
   */
  getBottlesInRowOf(cell: Cell): Bottle[] {
    return this.rows[ cell.position.y ].cells.filter(
      cell => !cell.isEmpty()
    ).map(cell => cell.bottle);
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
    return false
  }

  cellSelected(cell: Cell) {
    if (cell) {
      this.onCellSelected.emit(cell);
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

    let ret = this.highlighted.find(btl => btl.id === bottle.id) !== undefined;
    if (ret) {
      this.notificationService.debugAlert('highlighted: ' + bottle.nomCru);
    }
    return ret;
  }

  ngAfterViewInit(): void {
    if (this.selectable) {
      if (this.zoomable && !this.locker.inFridge) {
        this.setupPinchZoom(this.zoomable.nativeElement);
      } else if (this.zoomable && this.locker.inFridge) {
        this.setupPressGesture(this.zoomable.nativeElement);
      }
    }
  }

  protected setupPressGesture(elm: HTMLElement): void {
    const pressGesture = new Gesture(elm);

    pressGesture.listen();
    pressGesture.on('press', onPress);
    let self = this;

    function onPress(ev) {
      self.currentGesture = 'press';
      ev.preventDefault();
      self.selected = !self.selected;
    }
  }

  addTopRow() {
    this.hapticConfirm();

    if (!this.canIncreaseHeight()) {
      return
    }
    this.locker.dimension.y++;
    this.shiftBottles(0, 1);
    this.resetComponent();
  }

  removeTopRow() {
    this.hapticConfirm();
    if (!this.canRemoveRow(0)) {
      return
    }

    //décaler d'une rangée vers le haut toutes les bouteilles du casier
    this.shiftBottles(0, -1);

    this.locker.dimension.y--;
    this.resetComponent();
  }

  addRightColumn() {
    this.hapticConfirm();
    if (!this.canIncreaseWidth()) {
      return
    }
    this.locker.dimension.x++;
    this.resetComponent();
  }

  removeRightColumn() {
    this.hapticConfirm();
    if (!this.canRemoveColumn(this.locker.dimension.x - 1)) {
      return
    }
    this.locker.dimension.x--;
    this.resetComponent();
  }

  addBottomRow() {
    this.hapticConfirm();
    if (!this.canIncreaseHeight()) {
      return
    }
    this.locker.dimension.y++;
    this.resetComponent();
  }

  removeBottomRow() {
    this.hapticConfirm();
    if (!this.canRemoveRow(this.locker.dimension.y - 1)) {
      return
    }
    this.locker.dimension.y--;
    this.resetComponent();
  }

  addLeftColumn() {
    this.hapticConfirm();
    if (!this.canIncreaseWidth()) {
      return
    }

    this.locker.dimension.x++;
    //décaler les bouteilles d'une colonne vers la droite
    this.shiftBottles(1, 0);

    this.resetComponent();
  }

  removeLeftColumn() {
    this.hapticConfirm();
    if (!this.canRemoveColumn(0)) {
      return
    }

    //décaler les bouteilles d'une colonne vers la gauche
    this.shiftBottles(-1, 0);

    this.locker.dimension.x--;
    this.resetComponent();
  }

  protected canIncreaseHeight() {
    if (this.dimension.y >= SimpleLockerComponent.MAX_NB_ROWS) {
      this.notificationService.warning('locker-editor.maxi-row-reached');
      return false
    }
    return true
  }

  protected canIncreaseWidth() {
    if (this.dimension.x >= SimpleLockerComponent.MAX_NB_COLUMNS) {
      this.notificationService.warning('locker-editor.maxi-col-reached');
      return false
    }
    return true
  }

  protected canDecreaseHeight() {
    if (this.dimension.y > SimpleLockerComponent.MIN_NB_ROWS) {
      return true
    }
    this.notificationService.warning('locker-editor.mini-row-reached');
    return false
  }

  protected canDecreaseWidth() {
    if (this.dimension.x > SimpleLockerComponent.MIN_NB_COLUMNS) {
      return true
    }
    this.notificationService.warning('locker-editor.mini-col-reached');
    return false
  }

  //avant d'enlever une rangée on s'assure qu'elle est vide
  public canRemoveFirstRow(): boolean {
    return this.canRemoveRow(0)
  }

  //avant d'enlever une rangée on s'assure qu'elle est vide
  public canRemoveLastRow(): boolean {
    return this.canRemoveRow(this.dimension.y - 1);
  }

  //avant d'enlever une rangée on s'assure qu'elle est vide
  private canRemoveRow(rowNumber: number): boolean {
    if (!this.canDecreaseHeight()) {
      return false;
    }
    let btl = this.content.filter(
      (btl: Bottle) => btl.positions.filter(
        pos => pos.inRack(this.locker.id, this.rack) && pos.y === rowNumber
      ).length > 0
    );
    let filled = btl.length > 0;
    if (filled) {
      this.notificationService.warning('locker-editor.filled-row');
      return false
    }

    return true;
  }

  //avant d'enlever une colonne on s'assure qu'elle est vide
  public canRemoveFirstColumn(): boolean {
    return this.canRemoveColumn(0)
  }

  //avant d'enlever une colonne on s'assure qu'elle est vide
  public canRemoveLastColumn(): boolean {
    return this.canRemoveColumn(this.dimension.x - 1);
  }

  //avant d'enlever une colonne on s'assure qu'elle est vide
  private canRemoveColumn(colNumber: number): boolean {
    if (!this.canDecreaseWidth()) {
      return false;
    }
    let btl = this.content.filter(
      (btl: Bottle) => btl.positions.filter(
        pos => pos.inRack(this.locker.id, this.rack) && pos.x === colNumber
      ).length > 0
    );
    let filled = btl.length > 0;
    if (filled) {
      this.notificationService.warning('locker-editor.filled-column');
      return false
    }
    return true
  }

  private shiftBottles(shiftX: number, shiftY: number) {
    this.content.forEach(
      bottle => {
        bottle.positions.forEach(
          pos => {
            if (pos.inRack(this.locker.id, this.rack)) {
              pos.x += shiftX;
              pos.y += shiftY;
            }
          }
        )
      }
    )
  }
}

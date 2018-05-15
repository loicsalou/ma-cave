import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {SimpleLocker} from '../../model/simple-locker';
import {Dimension, Locker, LockerType} from '../../model/locker';
import {Bottle, Position} from '../../model/bottle';
import {NotificationService} from '../../service/notification.service';
import {LockerComponent} from './locker.component';
import {Gesture} from 'ionic-angular';
import {NativeProvider} from '../../providers/native/native';
import {RackDirective} from '../rack.directive';
import {DimensionOfDirective} from '../dimension-of.directive';
import {Observable} from 'rxjs/Observable';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {Row} from './row';
import {Cell} from './cell';

/**
 * Generated class for the SimpleLockerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'locker',
             templateUrl: './simple-locker.component.html'
             // styleUrls:[ 'locker.component.scss' ]
           })
export class SimpleLockerComponent extends LockerComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  protected static MAX_NB_COLUMNS: number = 16;
  protected static MIN_NB_COLUMNS: number = 1;
  protected static MAX_NB_ROWS: number = 16;
  protected static MIN_NB_ROWS: number = 1;

  @Input()
  locker: SimpleLocker;

  @Input()
  rack: number = 0;

  @Input()
  containerDimension$: Observable<Dimension>;

  @Input()
  editing: boolean = false;

  @Output()
  onRackSelected: EventEmitter<{ rack: Locker, selected: boolean }> = new EventEmitter<{ rack: Locker, selected: boolean }>();

  rows: Row[];
  containerDimension: Dimension;
  @ViewChild(DimensionOfDirective) private dimensionOfDirective: DimensionOfDirective<Locker>;

  private bogusBottles: { bottle: Bottle, position: Position }[] = [];
  private gesture: Gesture;
  private pressGesture: Gesture;
  private initialScale: number;
  private containerDimensionsSub: Subscription;
  private wrongLocker: boolean;

  constructor(private notificationService: NotificationService, nativeProvider: NativeProvider,
              @Inject('GLOBAL_CONFIG') private config) {
    super(nativeProvider);
  }

  get dimension(): Dimension {
    return this.locker.dimension;
  }

  ngOnInit(): void {
    if (this.locker.dimension) {
      //if (!this.rows) {
      this.resetComponent();
      //}
    } else {
      this.setAsWrongLocker();
    }
    this.adjustZoomAuto();
  }

  ngOnDestroy(): void {
    if (this.gesture) {
      this.gesture.destroy();
    }
    if (this.pressGesture) {
      this.pressGesture.destroy();
    }
    if (this.containerDimensionsSub) {
      this.containerDimensionsSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (this.selectable && this.zoomable) {
      if (this.locker.inFridge) {
        this.gesture = this.setupPinchZoom(this.zoomable.zoomableComponent);
        this.pressGesture = this.setupPressGesture(this.zoomable.zoomableComponent);
      //} else if (!this.locker.inFridge) {
      //  this.pressGesture = this.setupPressGesture(this.zoomable.zoomableComponent);
      }
    }
  }

  isShifted(): boolean {
    return this.locker.type == LockerType.shifted;
  }

  isDiamond(): boolean {
    return this.locker.type == LockerType.diamond;
  }

  isSimple(): boolean {
    return this.locker.type == LockerType.simple;
  }

  isFridge(): boolean {
    return false;
  }

  cellSelected(cell: Cell) {
    if (!this.editing && cell) {
      this.onCellSelected.emit(cell);
    }
  }

  /**
   *  init ou réinit du composant:
   *  - on (re)crée les rangées par rapport au locker modèle
   *  - On filtre les bouteilles de ce locker et on les place conformément aux positions auxquelles elles se rattachent
   *  - pour l'instant les éventuelles erreurs sont ignorées, à revoir
   */
  resetComponent() {
    this.rows = [];
    this.bogusBottles = [];
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
          );
        }
      }
    );
    if (this.bogusBottles && this.bogusBottles.length > 0) {
      // TODO avons-nous besoin de gérer les bogus bottles ?
      //this.handleBogusBottles();
    }
  }

  /**
   * placement d'une bouteille à une position donnée. Cela ne modifie en rien la bouteille ni le locker, c'est juste
   * de la présentation.
   * @param {Bottle} bottle
   * @param {Position} position
   */
  placeBottle(bottle: Bottle, position: Position) {
    if (this.rows.length <= position.y || !this.rows[ position.y ] || this.rows[ position.y ].cells.length <= position.x) {
      // TODO avons-nous besoin de gérer les bogus bottles ?
      this.bogusBottles.push({bottle: bottle, position: position});
    } else {
      let targetCell = this.rows[ position.y ].cells[ position.x ];
      targetCell.storeBottle(bottle, this.isHighlighted(bottle));
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

  addTopRow() {
    this.hapticConfirm();

    if (!this.canIncreaseHeight()) {
      return;
    }
    this.updateY(this.locker, 1);
    this.shiftBottles(0, 1);
    this.resetComponent();
  }

  removeTopRow() {
    this.hapticConfirm();
    if (!this.canRemoveRow(0)) {
      return;
    }

    //décaler d'une rangée vers le haut toutes les bouteilles du casier
    this.shiftBottles(0, -1);

    this.updateY(this.locker, -1);
    this.resetComponent();
  }

  addRightColumn() {
    this.hapticConfirm();
    if (!this.canIncreaseWidth()) {
      return;
    }
    this.updateX(this.locker, 1);
    this.resetComponent();
  }

  removeRightColumn() {
    this.hapticConfirm();
    if (!this.canRemoveColumn(this.locker.dimension.x - 1)) {
      return;
    }
    this.updateX(this.locker, -1);
    this.resetComponent();
  }

  addBottomRow() {
    this.hapticConfirm();
    if (!this.canIncreaseHeight()) {
      return;
    }
    this.updateY(this.locker, 1);
    this.resetComponent();
  }

  removeBottomRow() {
    this.hapticConfirm();
    if (!this.canRemoveRow(this.locker.dimension.y - 1)) {
      return;
    }
    this.updateY(this.locker, -1);
    this.resetComponent();
  }

  addLeftColumn() {
    this.hapticConfirm();
    if (!this.canIncreaseWidth()) {
      return;
    }

    this.updateX(this.locker, 1);
    //décaler les bouteilles d'une colonne vers la droite
    this.shiftBottles(1, 0);

    this.resetComponent();
  }

  removeLeftColumn() {
    this.hapticConfirm();
    if (!this.canRemoveColumn(0)) {
      return;
    }

    //décaler les bouteilles d'une colonne vers la gauche
    this.shiftBottles(-1, 0);

    this.updateX(this.locker, -1);
    this.resetComponent();
  }

  //avant d'enlever une rangée on s'assure qu'elle est vide
  public canRemoveFirstRow(): boolean {
    return this.canRemoveRow(0);
  }

  //avant d'enlever une rangée on s'assure qu'elle est vide
  public canRemoveLastRow(): boolean {
    return this.canRemoveRow(this.dimension.y - 1);
  }

  //avant d'enlever une colonne on s'assure qu'elle est vide
  public canRemoveFirstColumn(): boolean {
    return this.canRemoveColumn(0);
  }

  //avant d'enlever une colonne on s'assure qu'elle est vide
  public canRemoveLastColumn(): boolean {
    return this.canRemoveColumn(this.dimension.x - 1);
  }

  protected setupPressGesture(elm: HTMLElement): Gesture {
    const pressGesture = new Gesture(elm);

    pressGesture.listen();
    pressGesture.on('press', onPress);
    let self = this;

    function onPress(ev) {
      self.currentGesture = 'press';
      ev.preventDefault();
      if (self.editing) {
        self.selected = !self.selected;
        self.onRackSelected.emit({rack: this.locker, selected: self.selected});
      }
    }

    return pressGesture;
  }

  protected canIncreaseHeight() {
    if (this.dimension.y >= SimpleLockerComponent.MAX_NB_ROWS) {
      this.notificationService.warning('locker-editor.maxi-row-reached');
      return false;
    }
    return true;
  }

  protected canIncreaseWidth() {
    if (this.dimension.x >= SimpleLockerComponent.MAX_NB_COLUMNS) {
      this.notificationService.warning('locker-editor.maxi-col-reached');
      return false;
    }
    return true;
  }

  protected canDecreaseHeight() {
    if (this.dimension.y > SimpleLockerComponent.MIN_NB_ROWS) {
      return true;
    }
    this.notificationService.warning('locker-editor.mini-row-reached');
    return false;
  }

  protected canDecreaseWidth() {
    if (this.dimension.x > SimpleLockerComponent.MIN_NB_COLUMNS) {
      return true;
    }
    this.notificationService.warning('locker-editor.mini-col-reached');
    return false;
  }

  private handleBogusBottles() {
    const bugs = JSON.stringify(this.bogusBottles.map(
      (data: { bottle: Bottle, position: Position }) =>
        data.bottle.nomCru + ':' + data.position.x + ',' + data.position.y
                                )
    );
    this.notificationService.information(this.bogusBottles.length + ' bouteilles hors casier');
  }

  private initRow(nbcells: number, rowIndex: number): Row {
    let cells: Cell[] = [];
    //let rowId = this.locker.name + '-' + rowIndex;
    for (let i = 0; i < nbcells; i++) {
      let position = new Position(this.locker.id, i, rowIndex, this.rack);
      cells[ i ] = new Cell(position, this.config);
    }
    return new Row(cells, rowIndex);
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
      return false;
    }

    return true;
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
      return false;
    }
    return true;
  }

  private shiftBottles(shiftX: number, shiftY: number) {
    this.content.forEach((bottle: Bottle) => {
      bottle.positions = bottle.positions.map(
        (position: Position) => {
          if (position.inRack(this.locker.id, this.rack)) {
            return new Position(position.lockerId, position.x + shiftX,
              position.y + shiftY, position.rack);
          }
        }
      ).filter(pos => pos !== undefined);
    });
  }

  // zoom automatique pour que tous les casiers rentrent dans l'espace alloué
  private adjustZoomAuto() {
    if (this.containerDimension$) {
      this.containerDimensionsSub = this.containerDimension$.pipe(
        filter(dim => dim !== undefined)
      ).subscribe(
        dim => {
          // 32px de padding 16 de chaque côté
          this.containerDimension = {x: dim.x - 32, y: dim.y - 32};
          if (this.dimensionOfDirective) {
            const lockerDim = this.dimensionOfDirective.getContainerSize();
            this.initialScale = Math.min(
              this.containerDimension.x / lockerDim.x,
              this.containerDimension.y / lockerDim.y,
              1
            );
            if (this.gesture) {
              this.gesture.destroy();
            }
            this.gesture = this.setupPinchZoom(this.zoomable.zoomableComponent, this.initialScale);
          }
        }
      );
    }
  }

  private setAsWrongLocker() {
    this.wrongLocker = true;
  }
}

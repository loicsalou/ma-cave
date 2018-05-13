import {Component, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChildren} from '@angular/core';
import {FridgeLocker} from '../../model/fridge-locker';
import {Cell, LockerComponent} from './locker.component';
import {NotificationService} from '../../service/notification.service';
import {Dimension, Locker, LockerType} from '../../model/locker';
import {SimpleLockerComponent} from './simple-locker.component';
import {SimpleLocker} from '../../model/simple-locker';
import {NativeProvider} from '../../providers/native/native';
import {Position} from '../../model/bottle';
import {Gesture} from 'ionic-angular';

/**
 * Generated class for the CompositeLockerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'fridge-locker',
             templateUrl: './fridge-locker.component.html'
             // styleUrls:[ 'fridge-locker.component.scss' ]
           })
export class FridgeLockerComponent extends LockerComponent implements OnDestroy {
  protected static MAX_NB_COLUMNS: number = 8;
  protected static MIN_NB_COLUMNS: number = 1;
  protected static MAX_NB_ROWS: number = 40;
  protected static MIN_NB_ROWS: number = 1;

  @Input() fridge: FridgeLocker;
  @Input() editing: boolean = false;

  @ViewChildren(SimpleLockerComponent) rackComponents: QueryList<SimpleLockerComponent>;
  @Output()
  onRacksSelected: EventEmitter<number[]> = new EventEmitter<number[]>();

  private gesture: Gesture;

  constructor(private notificationService: NotificationService, nativeProvider: NativeProvider) {
    super(nativeProvider);
  }

  get dimension(): Dimension {
    return this.fridge.dimension;
  }

  ngOnDestroy(): void {
    if (this.gesture) {
      this.gesture.destroy();
    }
  }

  public resetComponent() {
    if (this.rackComponents) {
      this.rackComponents.forEach(
        (rack: LockerComponent) => {
          rack.resetComponent();
        }
      );
    }
  }

  anyRackSelected() {
    return this.rackComponents.filter(rack => rack.selected).length > 0;
  }

  cellSelected(cell: Cell) {
    if (!this.editing && cell) {
      this.onCellSelected.emit(cell);
    }
  }

  rackSelected(event: {rack:Locker, selected:boolean}) {
    this.onRacksSelected.emit(
      this.rackComponents
        .map((rack: SimpleLockerComponent, ix: number) => {
          return {rack: rack, ix: ix};
        })
        .filter((rack: { rack: SimpleLockerComponent, ix: number }) => rack.rack.selected)
        .map((rack: { rack: SimpleLockerComponent, ix: number }) => rack.ix)
    );
  }

  ngAfterViewInit(): void {
    if (this.zoomable && this.zoomable.zoomable) {
      this.gesture = this.setupPinchZoom(this.zoomable.zoomableComponent);
    }
  }

  addTopRack(): boolean {
    this.hapticConfirm();
    let currentHeight = this.fridge.racks.reduce((total, rack) => total + rack.dimension.y, 0);
    if (currentHeight + 1 > FridgeLockerComponent.MAX_NB_ROWS) {
      this.notificationService.information('locker-editor.maxi-row-reached');
      return false;
    }
    let rack = this.getNewRack();
    rack.id = this.fridge.id;
    this.fridge.racks = [ rack, ...this.fridge.racks ];
    this.fridge.dimensions = [ rack.dimension, ...this.fridge.dimensions ];
    this.content.forEach(
      btl => {
        btl.positions = btl.positions.map(
          pos => {
            let newPos = pos;
            if (pos.inLocker(this.fridge.id)) {
              newPos = new Position(pos.lockerId, pos.x, pos.y, pos.rack + 1);
            }
            return newPos;
          }
        );
      }
    );
  }

  addBottomRack(): boolean {
    this.hapticConfirm();
    let currentHeight = this.fridge.racks.reduce((total, rack) => total + rack.dimension.y, 0);
    if (currentHeight + 1 > FridgeLockerComponent.MAX_NB_ROWS) {
      this.notificationService.information('locker-editor.maxi-row-reached');
      return false;
    }
    let rack = this.getNewRack();
    rack.id = this.fridge.id;
    this.fridge.racks = [ ...this.fridge.racks, rack ];
    this.fridge.dimensions = [ ...this.fridge.dimensions, rack.dimension ];
    //this.resetComponent();
  }

  removeTopRack(): boolean {
    this.hapticConfirm();
    if (this.fridge.racks.length < 2) {
      this.notificationService.warning('locker-editor.mini-row-reached');
      return false;
    }
    ;
    // on vérifie que le rack à supprimer est vide
    let bottlesInRack = this.content.filter(
      btl => btl.positions.filter(
        pos => pos.inRack(this.fridge.id, 0)
      ).length > 0
    );
    if (bottlesInRack.length > 0) {
      this.notificationService.warning('locker-editor.rack-not-empty');
    } else {
      // le rack est vide on le supprime
      this.fridge.racks = this.fridge.racks.slice(1);
      this.fridge.dimensions = this.fridge.dimensions.slice(1);
      this.content.forEach(
        btl => {
          btl.positions.forEach(
            pos => {
              let newPos = pos;
              if (pos.inLocker(this.fridge.id)) {
                newPos = new Position(pos.lockerId, pos.x, pos.y, pos.rack - 1);
              }
              return newPos;
            }
          );
        }
      );
      //this.resetComponent();
    }
  }

  removeBottomRack(): boolean {
    this.hapticConfirm();
    if (this.fridge.racks.length < 2) {
      this.notificationService.warning('locker-editor.mini-row-reached');
      return false;
    }
    let rackIndex = this.fridge.racks.length - 1;
    // on vérifie que le rack est vide avant de le supprimer
    let bottlesInRack = this.content.filter(
      btl => btl.positions.filter(
        pos => pos.inRack(this.fridge.id, rackIndex)
      ).length > 0
    );
    if (bottlesInRack.length > 0) {
      this.notificationService.warning('locker-editor.rack-not-empty');
    } else {
      // il est vide, on le supprime
      this.fridge.racks = this.fridge.racks.slice(0, this.fridge.racks.length - 1);
      this.fridge.dimensions = this.fridge.dimensions.slice(0, this.fridge.dimensions.length - 1);
    }
  }

  addTopRow(): boolean {
    this.hapticConfirm();
    if (!this.canIncreaseHeight()) {
      return false;
    }
    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          this.updateY(rack.locker, 1);
          this.shiftBottles(ix, 0, 1);
        }
      }
    );

    this.resetComponent();
    return true;
  }

  removeTopRow(): boolean {
    this.hapticConfirm();
    if (!this.canRemoveFirstRow()) {
      return false;
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          this.updateY(rack.locker, -1);
          this.shiftBottles(ix, 0, -1);
        }
      }
    );

    this.resetComponent();
    return true;
  }

  addRightColumn(): boolean {
    this.hapticConfirm();
    if (!this.canIncreaseWidth()) {
      return false;
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          this.updateX(rack.locker, 1);
        }
      }
    );

    this.resetComponent();
    return true;
  }

  removeRightColumn(): boolean {
    this.hapticConfirm();
    if (!this.canRemoveLastColumn()) {
      return false;
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          this.updateX(rack.locker, -1);
        }
      }
    );

    this.resetComponent();
    return true;
  }

  addBottomRow(): boolean {
    this.hapticConfirm();
    if (!this.canIncreaseHeight()) {
      return false;
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          this.updateY(rack.locker, 1);
        }
      }
    );

    this.resetComponent();
    return true;
  }

  removeBottomRow(): boolean {
    this.hapticConfirm();
    if (!this.canRemoveLastRow()) {
      return false;
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          this.updateY(rack.locker, -1);
        }
      }
    );

    this.resetComponent();
    return true;
  }

  addLeftColumn(): boolean {
    this.hapticConfirm();
    if (!this.canIncreaseWidth()) {
      return false;
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          this.updateX(rack.locker, 1);
          this.shiftBottles(ix, 1, 0);
        }
      }
    );

    this.resetComponent();
    return true;
  }

  removeLeftColumn(): boolean {
    this.hapticConfirm();
    if (!this.canRemoveFirstColumn()) {
      return false;
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          this.updateX(rack.locker, -1);
          this.shiftBottles(ix, -1, 0);
        }
      }
    );

    this.resetComponent();
    return true;
  }

  //avant d'enlever une rangée on s'assure qu'elle est vide + un locker a au moins une rangée
  public canRemoveFirstRow(): boolean {
    if (!this.canDecreaseHeight()) {
      return false;
    }
    let result = true;
    this.rackComponents.filter(
      rack => rack.selected
    ).forEach(
      rack => result = result && rack.canRemoveFirstRow()
    );
    return result;
  }

  //avant d'enlever une rangée on s'assure qu'elle est vide + un locker a au moins une rangée
  public canRemoveLastRow(): boolean {
    if (!this.canDecreaseHeight()) {
      return false;
    }
    let result = true;
    this.rackComponents.filter(
      rack => rack.selected
    ).forEach(
      rack => result = result && rack.canRemoveLastRow()
    );
    return result;
  }

  //avant d'enlever une colonne on s'assure qu'elle est vide + un locker a au moins une colonne
  public canRemoveFirstColumn(): boolean {
    if (!this.canDecreaseWidth()) {
      return false;
    }
    let result = true;
    this.rackComponents.filter(
      rack => rack.selected
    ).forEach(
      rack => result = result && rack.canRemoveFirstColumn()
    );
    return result;
  }

  //avant d'enlever une colonne on s'assure qu'elle est vide + un locker a au moins une colonne
  public canRemoveLastColumn(): boolean {
    if (!this.canDecreaseWidth()) {
      return false;
    }
    let result = true;
    this.rackComponents.filter(
      rack => rack.selected
    ).forEach(
      rack => result = result && rack.canRemoveLastColumn()
    );
    return result;
  }

  /**
   * Comme on enlève une rangée à chaque rack sélectionné on vérifie que le frigo ne dépasse pas la hauteur
   * max d'un frigo
   * @returns {boolean}
   */
  protected canDecreaseHeight() {
    let nbSelectedRacks = this.rackComponents.filter(
      rack => rack.selected
    ).length;
    let currentHeight = this.fridge.racks.reduce((total, rack) => total + rack.dimension.y, 0);
    if (currentHeight - nbSelectedRacks > FridgeLockerComponent.MIN_NB_ROWS) {
      return true;
    } else {
      this.notificationService.warning('locker-editor.mini-row-reached');
      return false;
    }
  }

  /**
   * Comme on enlève une colonne à chaque rack sélectionné on vérifie qu'aucun des racks concernés ne passe en
   * dessous du nombre minimal de colonnes autorisé dans un rack
   * @returns {boolean}
   */
  protected canDecreaseWidth() {
    let minWidth = this.rackComponents.filter(
      rack => rack.selected
    ).reduce((min, rack) => min = Math.min(min, rack.locker.dimension.x), FridgeLockerComponent.MAX_NB_COLUMNS);
    if (minWidth - 1 > FridgeLockerComponent.MIN_NB_COLUMNS) {
      return true;
    } else {
      this.notificationService.warning('locker-editor.mini-col-reached');
      return false;
    }
  }

  /**
   * Comme on ajoute une rangée de haut à chaque rack sélectionné on vérifie que le frigo ne dépasse pas la hauteur
   * max d'un frigo
   * @returns {boolean}
   */
  protected canIncreaseHeight() {
    let nbSelectedRacks = this.rackComponents.filter(
      rack => rack.selected
    ).length;
    let currentHeight = this.fridge.racks.reduce((total, rack) => total + rack.dimension.y, 0);
    if (currentHeight + nbSelectedRacks >= FridgeLockerComponent.MAX_NB_ROWS) {
      this.notificationService.warning('locker-editor.maxi-row-reached');
      return false;
    }
    return true;
  }

  /**
   * On ajoute une rangée de haut à chaque rack sélectionné. On vérifie que chaque rack ne dépasse pas sa largeur
   * max autorisée.
   * @returns {boolean}
   */
  protected canIncreaseWidth() {
    if (this.dimension.x + 1 >= FridgeLockerComponent.MAX_NB_COLUMNS) {
      this.notificationService.warning('locker-editor.maxi-col-reached');
      return false;
    }
    return true;
  }

  private getNewRack(): Locker {
    let width = this.fridge.racks.reduce((max, oneRack) => Math.max(max, oneRack.dimension.x), 0);
    let formats = this.fridge.racks[ 0 ].supportedFormats;
    return new SimpleLocker(undefined, '', LockerType.shifted, {
      x: width,
      y: 1
    }, true, '', formats);

  }

  private shiftBottles(rack: number, shiftX: number, shiftY: number) {
    this.content.forEach(
      bottle => {
        bottle.positions = bottle.positions.map(
          pos => {
            if (pos.inRack(this.fridge.id, rack)) {
              return new Position(pos.lockerId, pos.x + shiftX, pos.y + shiftY, pos.rack);
            } else {
              return pos;
            }
          }
        );
      }
    );
  }
}

import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FridgeLocker} from '../../model/fridge-locker';
import {Cell, LockerComponent} from './locker.component';
import {NotificationService} from '../../service/notification.service';
import {Dimension} from '../../model/locker';
import {SimpleLockerComponent} from './simple-locker.component';

/**
 * Generated class for the CompositeLockerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'fridge-locker',
             templateUrl: './fridge-locker.component.html',
             styleUrls: [ '/fridge-locker.component.scss' ]
           })
export class FridgeLockerComponent extends LockerComponent implements OnInit {
  protected static MAX_NB_COLUMNS: number = 8;
  protected static MIN_NB_COLUMNS: number = 1;
  protected static MAX_NB_ROWS: number = 40;
  protected static MIN_NB_ROWS: number = 1;

  //racks composant le frigo, càd npmbre de rangées
  //chaque rangée est en fait un locker ayant ses propres dimensions l x L
  //Celles-ci n'ont pas forcément toutes la même hauteur, ex dans un frigo, les étagères permettent de créer des
  // racks de différentes hauteurs
  @Input()
  fridge: FridgeLocker;

  @ViewChildren(SimpleLockerComponent) rackComponents: QueryList<SimpleLockerComponent>;

  constructor(private notificationService: NotificationService) {
    super()
  }

  ngOnInit(): void {
  }

  get dimension(): Dimension {
    return this.fridge.dimension
  }

  public resetComponent() {
    this.rackComponents.forEach(
      (rack: LockerComponent) => {
        rack.resetComponent();
      }
    )
  }

  cellSelected(cell: Cell) {
    if (cell) {
      this.onCellSelected.emit(cell);
    }
  }

  ngAfterViewInit(): void {
    if (this.zoomable) {
      this.setupPinchZoom(this.zoomable.nativeElement);
    }
  }

  addTopRow(): boolean {
    if (!this.canIncreaseHeight()) {
      return false
    }
    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          rack.locker.dimension.y++;
          this.shiftBottles(ix, 0, 1);
        }
      }
    )

    this.resetComponent();
    return true;
  }

  removeTopRow(): boolean {
    if (!this.canRemoveFirstRow()) {
      return false
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          rack.locker.dimension.y--;
          this.shiftBottles(ix, 0, -1);
        }
      }
    )

    this.resetComponent();
    return true;
  }

  addRightColumn(): boolean {
    if (!this.canIncreaseWidth()) {
      return false
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          rack.locker.dimension.x++;
        }
      }
    )

    this.resetComponent();
    return true;
  }

  removeRightColumn(): boolean {
    if (!this.canRemoveLastColumn()) {
      return false
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          rack.locker.dimension.x--;
        }
      }
    )

    this.resetComponent();
    return true;
  }

  addBottomRow(): boolean {
    if (!this.canIncreaseHeight()) {
      return false
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          rack.locker.dimension.y++;
        }
      }
    )

    this.resetComponent();
    return true;
  }

  removeBottomRow(): boolean {
    if (!this.canRemoveLastRow()) {
      return false
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          rack.locker.dimension.y--;
        }
      }
    )

    this.resetComponent();
    return true;
  }

  addLeftColumn(): boolean {
    if (!this.canIncreaseWidth()) {
      return false
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          rack.locker.dimension.x++;
          this.shiftBottles(ix, 1, 0);
        }
      }
    )

    this.resetComponent();
    return true;
  }

  removeLeftColumn(): boolean {
    if (!this.canRemoveFirstColumn()) {
      return false
    }

    this.rackComponents.forEach(
      (rack: SimpleLockerComponent, ix: number) => {
        if (rack.selected) {
          rack.locker.dimension.x;
          this.shiftBottles(ix, -1, 0);
        }
      }
    )

    this.resetComponent();
    return true;
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
      return true
    } else {
      this.notificationService.warning('locker-editor.mini-row-reached');
      return false
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
    ).reduce((min, rack) => min = Math.min(min, rack.locker.dimension.x), FridgeLockerComponent.MAX_NB_COLUMNS)
    if (minWidth - 1 > FridgeLockerComponent.MIN_NB_COLUMNS) {
      return true
    } else {
      this.notificationService.warning('locker-editor.mini-col-reached');
      return false
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
      return false
    }
    return true
  }

  /**
   * On ajoute une rangée de haut à chaque rack sélectionné. On vérifie que chaque rack ne dépasse pas sa largeur
   * max autorisée.
   * @returns {boolean}
   */
  protected canIncreaseWidth() {
    let currentWidth = this.fridge.racks.reduce((max, rack) => max = Math.max(max, rack.dimension.x), 0);
    if (this.dimension.x + 1 >= FridgeLockerComponent.MAX_NB_COLUMNS) {
      this.notificationService.warning('locker-editor.maxi-col-reached');
      return false
    }
    return true
  }

  //avant d'enlever une rangée on s'assure qu'elle est vide + un locker a au moins une rangée
  public canRemoveFirstRow(): boolean {
    if (!this.canDecreaseHeight()) {
      return false
    }
    let result = true;
    this.rackComponents.filter(
      rack => rack.selected
    ).forEach(
      rack => result = result && rack.canRemoveFirstRow()
    );
    return result
  }

  //avant d'enlever une rangée on s'assure qu'elle est vide + un locker a au moins une rangée
  public canRemoveLastRow(): boolean {
    if (!this.canDecreaseHeight()) {
      return false
    }
    let result = true;
    this.rackComponents.filter(
      rack => rack.selected
    ).forEach(
      rack => result = result && rack.canRemoveLastRow()
    );
    return result
  }

  //avant d'enlever une colonne on s'assure qu'elle est vide + un locker a au moins une colonne
  public canRemoveFirstColumn(): boolean {
    if (!this.canDecreaseWidth()) {
      return false
    }
    let result = true;
    this.rackComponents.filter(
      rack => rack.selected
    ).forEach(
      rack => result = result && rack.canRemoveFirstColumn()
    );
    return result
  }

  //avant d'enlever une colonne on s'assure qu'elle est vide + un locker a au moins une colonne
  public canRemoveLastColumn(): boolean {
    if (!this.canDecreaseWidth()) {
      return false
    }
    let result = true;
    this.rackComponents.filter(
      rack => rack.selected
    ).forEach(
      rack => result = result && rack.canRemoveLastColumn()
    );
    return result
  }

  private shiftBottles(rack: number, shiftX: number, shiftY: number) {
    this.content.forEach(
      bottle => {
        bottle.positions.forEach(
          pos => {
            if (pos.inRack(this.fridge.id, rack)) {
              pos.x += shiftX;
              pos.y += shiftY;
            }
          }
        )
      }
    )
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';
import {BottleSize, Dimension, Locker, LockerType} from '../../model/locker';
import {FridgeLocker} from '../../model/fridge-locker';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {SimpleLocker} from '../../model/simple-locker';
import {Bottle} from '../../model/bottle';
import {NotificationService} from '../../service/notification.service';
import {LockerComponent} from '../../components/locker/locker.component';

/**
 * Generated class for the LockerEditorComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@IonicPage()
@Component({
             selector: 'locker-editor2',
             templateUrl: './locker-editor2.page.html',
             styleUrls: [ '/locker-editor2.page.scss' ]
           })
export class LockerEditor2Page implements OnInit {
  private static MAX_NB_COLUMNS: number = 16;
  private static MIN_NB_COLUMNS: number = 1;
  private static MAX_NB_ROWS: number = 16;
  private static MIN_NB_ROWS: number = 1;

  lockerTypes: LockerType[];
  lockerFormats: BottleSize[];

  name: string;
  comment: string;
  supportedFormats: BottleSize[];
  type: LockerType;
  @ViewChild('lockerCmp') lockerComponent: LockerComponent;

  //locker normal
  lockerDimension: Dimension;
  locker: Locker;
  lockerContent: Bottle[];

  //locker composite (ex. frigo)
  private fridge: FridgeLocker;
  fridgeDimension: Dimension;

  fridgeLockersDimensions: Dimension[] = [];

  constructor(private params: NavParams, private cellarService: CellarPersistenceService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    if (this.params.data) {
      this.locker = this.params.data[ 'locker' ];
      this.lockerContent = this.params.data[ 'content' ].filter(
        bottle => bottle.positions.filter(
          pos => pos.inLocker(this.locker.id)).length > 0
      );
    }
  }

  isFridge(): boolean {
    return this.type === LockerType.fridge;
  }

  private getDefaultSupportedFormats(): BottleSize[] {
    return this.lockerFormats.slice(0, 6);
  }

  saveLocker() {
    let locker: Locker;
    if (this.type === LockerType.fridge) {
      //name: string, type: LockerType, dimensions: Dimension[], comment?: string, defaultImage?: string,
      // supportedFormats?: BottleSize[], imageUrl?: string
      locker = new FridgeLocker(undefined, this.name, this.type, this.fridgeLockersDimensions, this.comment, this.supportedFormats);
    } else {
      locker = new SimpleLocker(undefined, this.name, this.type, this.lockerDimension, this.comment, this.supportedFormats);
    }
    this.cellarService.createLocker(locker);
  }

  addTopRow() {
    if (!this.canIncreaseHeight()) {
      return
    }

    this.locker.dimension.y++;
    //décaler d'une rangée vers le bas toutes les bouteilles du casier
    this.shiftBottles(0, 1);

    this.lockerComponent.resetComponent();
  }

  removeTopRow() {
    if (!this.canRemoveRow(0)) {
      return
    }

    //décaler d'une rangée vers le haut toutes les bouteilles du casier
    this.shiftBottles(0, -1);

    this.locker.dimension.y--;
    this.lockerComponent.resetComponent();
  }

  addRightColumn() {
    if (!this.canIncreaseWidth()) {
      return
    }
    this.locker.dimension.x++;
    this.lockerComponent.resetComponent();
  }

  removeRightColumn() {
    if (!this.canRemoveColumn(this.locker.dimension.x - 1)) {
      return
    }
    this.locker.dimension.x--;
    this.lockerComponent.resetComponent();
  }

  addBottomRow() {
    if (!this.canIncreaseHeight()) {
      return
    }
    this.locker.dimension.y++;
    this.lockerComponent.resetComponent();
  }

  removeBottomRow() {
    if (!this.canRemoveRow(this.locker.dimension.y - 1)) {
      return
    }
    this.locker.dimension.y--;
    this.lockerComponent.resetComponent();
  }

  addLeftColumn() {
    if (!this.canIncreaseWidth()) {
      return
    }

    this.locker.dimension.x++;
    //décaler les bouteilles d'une colonne vers la droite
    this.shiftBottles(1, 0);

    this.lockerComponent.resetComponent();
  }

  removeLeftColumn() {
    if (!this.canRemoveColumn(0)) {
      return
    }

    //décaler les bouteilles d'une colonne vers la gauche
    this.shiftBottles(-1, 0);

    this.locker.dimension.x--;
    this.lockerComponent.resetComponent();
  }

  private canIncreaseHeight() {
    if (this.locker.dimension.y >= LockerEditor2Page.MAX_NB_ROWS) {
      this.notificationService.warning('locker-editor.maxi-row-reached');
      return false
    }
    return true
  }

  private canIncreaseWidth() {
    if (this.locker.dimension.x >= LockerEditor2Page.MAX_NB_COLUMNS) {
      this.notificationService.warning('locker-editor.maxi-col-reached');
      return false
    }
    return true
  }

  //avant d'enlever une rangée on s'assure qu'elle est vide
  private canRemoveRow(rowNumber: number): boolean {
    let btl = this.lockerComponent.content.filter(
      (btl: Bottle) => btl.positions.filter(
        pos => pos.inLocker(this.locker.id) && pos.y === rowNumber
      ).length > 0
    );
    let filled = btl.length > 0;
    if (filled) {
      this.notificationService.error('locker-editor.filled-row');
      return false
    }

    return true;
  }

  //avant d'enlever une colonne on s'assure qu'elle est vide
  private canRemoveColumn(colNumber: number): boolean {
    let btl = this.lockerContent.filter(
      (btl: Bottle) => btl.positions.filter(
        pos => pos.inLocker(this.locker.id) && pos.x === colNumber
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
    this.lockerContent.forEach(
      bottle => {
        bottle.positions.forEach(
          pos => {
            if (pos.inLocker(this.locker.id)) {
              pos.x += shiftX;
              pos.y += shiftY;
            }
          }
        )
      }
    )
  }

}

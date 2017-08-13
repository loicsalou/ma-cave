import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Content, Gesture, Haptic, IonicPage, ModalController, NavParams, Slides} from 'ionic-angular';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {Locker, LockerType} from '../../model/locker';
import {SimpleLockerComponent} from '../../components/locker/simple-locker.component';
import {NotificationService} from '../../service/notification.service';
import {Subscription} from 'rxjs/Subscription';
import {Bottle, Position} from '../../model/bottle';
import {SimpleLocker} from '../../model/simple-locker';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {LockerEditor2Page} from '../locker-editor2/locker-editor2.page';
import {Cell} from '../../components/locker/locker.component';
import {LockerEditorPage} from '../locker-editor/locker-editor.page';
import * as _ from 'lodash';

/**
 * Generated class for the CellarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
             selector: 'page-cellar',
             templateUrl: './cellar.page.html',
             styleUrls: [ '/cellar.page.scss' ]
           })
export class CellarPage implements OnInit, AfterViewInit, OnDestroy {

  private otherLockers: Locker[];
  private paginatedLocker: Locker;
  @ViewChild(Slides) slides: Slides;

  pendingCell: Cell;
  pendingBottleTipVisible: boolean = false;
  selectedCell: Cell;
  private lockersSub: Subscription;
  private lockerContent: Bottle[];

  @ViewChild('placedLockerComponent')
  private placedLockerComponent: SimpleLockerComponent;
  private bottlesToPlaceLocker: SimpleLocker;
  private bottlesToPlace: Bottle[];
  private bottlesToHighlight: Bottle[];

  @ViewChild('zoomable') zoomable: ElementRef;

  private scale: number = 1;

  constructor(private cellarService: CellarPersistenceService, private bottleService: BottlePersistenceService,
              private notificationService: NotificationService, private haptic: Haptic,
              private modalCtrl: ModalController, private params: NavParams) {
  }

  ngOnInit(): void {
    this.bottlesToPlace = this.params.data[ 'bottlesToPlace' ];
    if (this.bottlesToPlace && this.bottlesToPlace.length > 0) {
      this.bottlesToPlaceLocker = new SimpleLocker(undefined, 'placedLocker', LockerType.simple, {
        x: this.bottlesToPlace.reduce((total, btl) => total + btl.numberToBePlaced(), 0),
        y: 1
      }, false)
      ;
    }
    this.bottlesToHighlight = this.params.data[ 'bottlesToHighlight' ];
    this.lockersSub = this.cellarService.allLockersObservable.subscribe(
      lockers => {
        this.otherLockers = lockers;
        this.resetPaginatedLocker();
      }
    );

    this.getLockersContent(this.paginatedLocker);
  }

  ngAfterViewInit(): void {
    if (this.bottlesToPlace) {
      let ix = 0;
      this.bottlesToPlace.forEach(
        bottle => {
          let nbBottles = bottle.numberToBePlaced();
          for (let i = 0; i < nbBottles; i++) {
            this.placedLockerComponent.placeBottle(bottle, new Position(undefined, ix++, 0))
          }
        }
      )
    }
  }

  ngOnDestroy(): void {
    this.lockersSub.unsubscribe();
  }

  ionSlideDrag(event: any) {
    //this.percent = item.getSlidingPercent();
    //console.info("drag " + this.percent + " %");
    //if (this.percent < 0 && Math.abs(this.percent) > 0.15) {
    //  this.addToFavoritesOrRemove(null, item, bottle);
    //}
    console.info();
  }

  increaseSize() {
    this.scale += .1;
    this.zoomable.nativeElement.style.transform = `scale(${this.scale}, ${this.scale})`;
  }

  decreaseSize() {
    this.scale -= .1;
    this.zoomable.nativeElement.style.transform = `scale(${this.scale}, ${this.scale})`;
  }

  resetPaginatedLocker() {
    if (this.otherLockers.length > 0) {
      let ix = this.slides.getActiveIndex();
      if (ix == undefined) {
        ix = 0;
      }
      this.paginatedLocker = this.otherLockers[ ix ];
    }
  }

  createLocker() {
    let editorModal = this.modalCtrl.create(LockerEditorPage, {}, {showBackdrop: false});
    editorModal.present();
  }

  updateLocker() {
    let editorModal = this.modalCtrl.create(LockerEditor2Page, {
      locker: this.paginatedLocker,
      content: this.lockerContent
    }, {showBackdrop: true});
    editorModal.present();
  }

  private getLockersContent(locker: Locker) {
    this.bottleService.allBottlesObservable.subscribe(
      (bottles: Bottle[]) => this.lockerContent = bottles
    );
  }

  deleteLocker() {
    this.cellarService.deleteLocker(this.paginatedLocker);
  }

  showTip() {
    this.pendingBottleTipVisible = true;
    setTimeout(() => {
      this.pendingBottleTipVisible = false;
    }, 3000)
  }

  slideChanged() {
    this.resetPaginatedLocker();
  }

  private moveCellContentTo(source: Cell, target: Cell) {
    if (source) {
      let bottle = source.withdraw();
      bottle.removeFromPosition(source.position);
      source.setSelected(false);
      target.storeBottle(bottle, this.isBottleToHighlight(bottle));
      bottle.addNewPosition(target.position);
      this.bottleService.update([ bottle ]);
    }
  }

  private isBottleToHighlight(bottle: Bottle) {
    if (this.bottlesToHighlight) {
      return this.bottlesToHighlight.find(btl => btl.id === bottle.id) !== undefined
    }
    else {
      return false;
    }
  }

  cellSelected(cell: Cell) {
    this.cellarService.isEmpty(this.paginatedLocker);
    if (cell) {
      this.haptic.selection();
      if (this.pendingCell) {
        if (cell.position.equals(this.pendingCell.position)) {
          if (cell.bottle && cell.bottle.id === this.pendingCell.bottle.id) {
            this.pendingCell = undefined;
            this.selectedCell.setSelected(false);
            this.selectedCell = undefined;
            return;
          }
        }
        // une cellule était déjà sélectionnée qui contenait une bouteille
        // - déplacer cette bouteille dans la nouvelle cellule et déselectionner les 2 cellules
        // - si la nouvelle cellule contient aussi une bouteille alors la cellule sélectionnée devient cette
        // nouvelle cellule, sinon on déplace la bouteille et on déselectionne les 2 cellules
        let incomingCell = _.clone(cell);
        //on déplace la bouteille pré-enregistrée dans la cellule choisie
        this.moveCellContentTo(this.pendingCell, cell);
        //plus de cellule sélectionnée
        this.pendingCell = undefined;
        if (!incomingCell.isEmpty()) {
          this.pendingCell = incomingCell;
        } else {
          this.selectedCell.setSelected(false);
        }
      } else {
        //aucune cellule n'était sélectionnée
        if (cell.isEmpty()) {
          //cellule vide mais rien en transit ==> erreur
          this.notificationService.warning('La cellule sélectionnée est vide');
        } else {
          //nouvelle bouteille en transit ==> on marque la cellule comme en transit et on stocke localement
          this.selectedCell = cell;
          this.selectedCell.setSelected(true);
          this.pendingCell = cell;
        }
      }
    }
  }
}

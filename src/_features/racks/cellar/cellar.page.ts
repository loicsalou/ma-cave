import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavController, NavParams, Slides} from 'ionic-angular';
import {CellarPersistenceService} from '../../../service/cellar-persistence.service';
import {Locker, LockerType} from '../../../model/locker';
import {SimpleLockerComponent} from '../../../components/locker/simple-locker.component';
import {NotificationService} from '../../../service/notification.service';
import {Subscription} from 'rxjs/Subscription';
import {Bottle, Position} from '../../../model/bottle';
import {SimpleLocker} from '../../../model/simple-locker';
import {BottlePersistenceService} from '../../../service/bottle-persistence.service';
import {Cell} from '../../../components/locker/locker.component';
import * as _ from 'lodash';
import {NativeProvider} from '../../../providers/native/native';
import {BottleDetailPage} from '../../browse/bottle-detail/page-bottle-detail';
import {UpdateLockerPage} from '../update-locker/update-locker.page';
import {CreateLockerPage} from '../create-locker/create-locker.page';
import {ApplicationState} from '../../../app/state/app.state';
import {Store} from '@ngrx/store';
import {BottlesQuery} from '../../../app/state/bottles.state';
import {LogoutAction} from '../../../app/state/shared.actions';
import {UpdateBottlesAction, WithdrawBottleAction} from '../../../app/state/bottles.actions';

/**
 * Generated class for the CellarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
             selector: 'page-cellar',
             templateUrl: './cellar.page.html'
             // styleUrls:[ 'cellar.page.scss' ]
           })
export class CellarPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(Slides) slides: Slides;
  @ViewChild('zoomable') zoomable: ElementRef;
  @ViewChild('placedLockerComponent') private;

  pendingBottleTipVisible: boolean = false;
  selectedCell: Cell;

  private placedLockerComponent: SimpleLockerComponent;
  private otherLockers: Locker[];
  private paginatedLocker: Locker;
  private lockersSub: Subscription;
  private lockerContent: Bottle[];
  private _bottlesToPlaceLocker: SimpleLocker;
  private bottlesToPlace: Bottle[];
  private bottlesToHighlight: Bottle[];
  private bottlesSubscription: Subscription;
  private _pendingCell: Cell;

  constructor(private navCtrl: NavController,
              private cellarService: CellarPersistenceService,
              private bottleService: BottlePersistenceService,
              private notificationService: NotificationService,
              private nativeProvider: NativeProvider,
              private modalCtrl: ModalController,
              private params: NavParams,
              private store: Store<ApplicationState>) {
  }

  get pendingCell(): Cell {
    return this._pendingCell;
  }

  set pendingCell(value: Cell) {
    this._pendingCell = value;
  }

  get bottlesToPlaceLocker(): SimpleLocker {
    return this._bottlesToPlaceLocker;
  }

  ngOnInit(): void {
    this.nativeProvider.feedBack();
    this.bottlesToPlace = this.params.data[ 'bottlesToPlace' ];
    if (this.bottlesToPlace && this.bottlesToPlace.length > 0) {
      this._bottlesToPlaceLocker = new SimpleLocker(undefined, 'placedLocker', LockerType.simple, {
        x: this.bottlesToPlace.reduce((total, btl) => total + btl.quantite_courante - btl.positions.length, 0),
        y: 1
      }, false)
      ;
    }
    this.bottlesToHighlight = this.params.data[ 'bottlesToHighlight' ];
    if (this.bottlesToHighlight) {
      this.notificationService.debugAlert('nombre de bouteilles à mettre en valeur: ' + this.bottlesToHighlight.length);
    }
    this.lockersSub = this.cellarService.allLockersObservable.subscribe(
      lockers => {
        this.otherLockers = lockers;
        this.resetPaginatedLocker();
      }
    );

    this.getLockersContent();
  }

  ngAfterViewInit(): void {
    if (this.bottlesToPlace) {
      let ix = 0;
      this.bottlesToPlace.forEach(
        bottle => {
          let nbBottles = bottle.quantite_courante - bottle.positions.length;
          for (let i = 0; i < nbBottles; i++) {
            this.placedLockerComponent.placeBottle(bottle, new Position(undefined, ix++, 0));
          }
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.lockersSub.unsubscribe();
    this.bottlesSubscription.unsubscribe();
  }

  logout() {
    this.store.dispatch(new LogoutAction());
    this.navCtrl.popToRoot();
  }

  zoomOnBottle(pendingCell: Cell) {
    let bottle = this._pendingCell.bottle;
    let zoomedBottles = this.getBottlesInRowOf(this._pendingCell);
    this.navCtrl.push(BottleDetailPage, {bottleEvent: {bottles: zoomedBottles, bottle: bottle}});
  }

  withdraw(pendingCell: Cell) {
    let bottle = this._pendingCell.bottle;
    if (bottle) {
      this.store.dispatch(new WithdrawBottleAction(bottle, pendingCell.position));
      this._pendingCell.setSelected(false);
      this._pendingCell = undefined;
      this.notificationService.information('messages.withdraw-complete');
    }
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
    let editorModal = this.modalCtrl.create(CreateLockerPage, {}, {showBackdrop: false});
    editorModal.present();
  }

  updateLocker() {
    this.nativeProvider.feedBack();
    let editorModal = this.modalCtrl.create(UpdateLockerPage, {
      locker: this.paginatedLocker,
      content: this.lockerContent
    }, {showBackdrop: true});
    editorModal.present();
  }

  deleteLocker() {
    this.cellarService.deleteLocker(this.paginatedLocker);
  }

  showTip() {
    this.nativeProvider.feedBack();
    this.pendingBottleTipVisible = true;
    setTimeout(() => {
      this.pendingBottleTipVisible = false;
    }, 3000);
  }

  slideChanged() {
    this.resetPaginatedLocker();
  }

  cellSelected(cell: Cell) {
    this.nativeProvider.feedBack();

    if (cell) {
      if (this._pendingCell) {
        if (cell.bottle && cell.bottle.id === this._pendingCell.bottle.id) {
          //déplacer une bouteille vers un casier qui contient la même n'a pas de sens et fout la grouille...
          if (cell.position.equals(this._pendingCell.position)) {
            //retour à la case départ
            this._pendingCell = undefined;
            this.selectedCell.setSelected(false);
            this.selectedCell = undefined;
            return;
          }
          else {
            //autant garder la bouteille d'origine sélectionnée comme celle que l'on déplace
            return;
          }
        }
        // une cellule était déjà sélectionnée qui contenait une bouteille
        // - déplacer cette bouteille dans la nouvelle cellule et déselectionner les 2 cellules
        // - si la nouvelle cellule contient aussi une bouteille alors la cellule sélectionnée devient cette
        // nouvelle cellule, sinon on déplace la bouteille et on déselectionne les 2 cellules
        let targetCell = _.clone(cell);
        //on déplace la bouteille pré-enregistrée dans la cellule choisie
        this.moveCellContentTo(this._pendingCell, cell);
        //plus de cellule sélectionnée
        this._pendingCell = undefined;
        if (!targetCell.isEmpty()) {
          this._pendingCell = targetCell;
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
          this._pendingCell = cell;
        }
      }
    }
  }

  private getLockersContent() {
    //this.bottlesSubscription = this.bottleService.allBottlesObservable.subscribe(
    this.bottlesSubscription = this.store.select(BottlesQuery.getBottles).subscribe(
      (bottles: Bottle[]) => {
        this.lockerContent = bottles;
      }
    );
  }

  private moveCellContentTo(source: Cell, target: Cell) {
    if (source) {
      let bottle = new Bottle(source.withdraw());
      bottle.positions.filter(pos => !pos.equals(source.position));
      source.setSelected(false);
      target.storeBottle(bottle, this.isBottleToHighlight(bottle));
      bottle.positions.push(target.position);
      this.store.dispatch(new UpdateBottlesAction([bottle]))
    }
  }

  private isBottleToHighlight(bottle: Bottle) {
    if (this.bottlesToHighlight) {
      let ret = this.bottlesToHighlight.find(btl => btl.id === bottle.id) !== undefined;
      if (ret) {
        this.notificationService.debugAlert('highlighted: ' + bottle.nomCru);
      }
      return ret;
    }
    else {
      return false;
    }
  }

  private getBottlesInRowOf(pendingCell: Cell) {
    let allBottlesInRow = [];
    this.lockerContent.forEach(
      bottle => {
        if (bottle.positions) {
          return bottle.positions.forEach(
            pos => {
              if (pos.inLocker(pendingCell.position.lockerId) && (pos.y === pendingCell.position.y)) {
                allBottlesInRow.push(bottle);
              }
            });
        }
      }
    );
    return allBottlesInRow;
  }
}

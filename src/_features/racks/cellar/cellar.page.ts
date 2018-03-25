import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
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
import {LoginService} from '../../../service/login.service';
import {BottleDetailPage} from '../../browse/bottle-detail/page-bottle-detail';
import {UpdateLockerPage} from '../update-locker/update-locker.page';
import {CreateLockerPage} from '../create-locker/create-locker.page';

/**
 * Generated class for the CellarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
             selector: 'page-cellar',
             templateUrl: './cellar.page.html',
             styleUrls: [ '/cellar.page.scss' ]
           })
export class CellarPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(Slides) slides: Slides;
  pendingCell: Cell;
  pendingBottleTipVisible: boolean = false;
  selectedCell: Cell;
  @ViewChild('zoomable') zoomable: ElementRef;
  private otherLockers: Locker[];
  private paginatedLocker: Locker;
  private lockersSub: Subscription;
  private lockerContent: Bottle[];
  @ViewChild('placedLockerComponent')
  private placedLockerComponent: SimpleLockerComponent;
  private bottlesToPlaceLocker: SimpleLocker;
  private bottlesToPlace: Bottle[];
  private bottlesToHighlight: Bottle[];
  private scale: number = 1;
  private bottlesSubscription: Subscription;

  constructor(private navCtrl: NavController,
              private cellarService: CellarPersistenceService,
              private bottleService: BottlePersistenceService,
              private notificationService: NotificationService,
              private nativeProvider: NativeProvider,
              private modalCtrl: ModalController,
              private loginService: LoginService,
              private params: NavParams) {
  }

  ngOnInit(): void {
    this.nativeProvider.feedBack();
    this.bottlesToPlace = this.params.data[ 'bottlesToPlace' ];
    if (this.bottlesToPlace && this.bottlesToPlace.length > 0) {
      this.bottlesToPlaceLocker = new SimpleLocker(undefined, 'placedLocker', LockerType.simple, {
        x: this.bottlesToPlace.reduce((total, btl) => total + btl.numberToBePlaced(), 0),
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

  logout() {
    this.loginService.logout();
    this.navCtrl.popToRoot();
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
    this.bottlesSubscription.unsubscribe();
  }

  zoomOnBottle(pendingCell: Cell) {
    let bottle = this.pendingCell.bottle;
    let zoomedBottles = this.getBottlesInRowOf(this.pendingCell);
    this.navCtrl.push(BottleDetailPage, {bottleEvent: {bottles: zoomedBottles, bottle: bottle}});
  }

  withdraw(pendingCell: Cell) {
    let bottle = this.pendingCell.bottle;
    if (bottle) {
      this.bottleService.withdraw(bottle, pendingCell.position);
      this.pendingCell.setSelected(false);
      this.pendingCell = undefined;
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
    }, 3000)
  }

  slideChanged() {
    this.resetPaginatedLocker();
  }

  cellSelected(cell: Cell) {
    this.nativeProvider.feedBack();

    if (cell) {
      if (this.pendingCell) {
        if (cell.bottle && cell.bottle.id === this.pendingCell.bottle.id) {
          //déplacer une bouteille vers un casier qui contient la même n'a pas de sens et fout la grouille...
          if (cell.position.equals(this.pendingCell.position)) {
            //retour à la case départ
            this.pendingCell = undefined;
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
        this.moveCellContentTo(this.pendingCell, cell);
        //plus de cellule sélectionnée
        this.pendingCell = undefined;
        if (!targetCell.isEmpty()) {
          this.pendingCell = targetCell;
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

  private getLockersContent() {
    this.bottlesSubscription = this.bottleService.allBottlesObservable.subscribe(
      (bottles: Bottle[]) => {
        this.lockerContent = bottles
      }
    );
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
                allBottlesInRow.push(bottle)
              }
            })
        }
      }
    );
    return allBottlesInRow;
  }
}

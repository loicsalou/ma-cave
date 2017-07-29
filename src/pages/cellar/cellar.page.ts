import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, ModalController, Slides} from 'ionic-angular';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {Locker} from '../../model/locker';
import {Cell} from '../../components/locker/locker.component';
import {NotificationService} from '../../service/notification.service';
import * as _ from 'lodash';
import {LockerEditorPage} from '../locker-editor/locker-editor.page';
import {Subscription} from 'rxjs/Subscription';
import {Bottle} from '../../model/bottle';

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
export class CellarPage implements OnInit, OnDestroy {

  private otherLockers: Locker[];
  //private chosenLocker: Locker;
  private paginatedLocker: Locker;
  @ViewChild(Slides) slides: Slides;

  pendingCell: Cell;
  pendingBottleTipVisible: boolean = false;
  selectedCell: Cell;
  private lockersSub: Subscription;
  private lockerContent: Bottle[];

  constructor(private cellarService: CellarPersistenceService, private notificationService: NotificationService,
              private modalCtrl: ModalController) {
  }

  ngOnInit(): void {
    this.lockersSub=this.cellarService.allLockersObservable.subscribe(
      lockers => {
        this.otherLockers = lockers;
        this.resetPaginatedLocker();
      }
    );
    this.cellarService.fetchAllLockers();
  }

  ngOnDestroy(): void {
    this.lockersSub.unsubscribe();
  }

  resetPaginatedLocker() {
    if (this.otherLockers.length > 0) {
      let ix = this.slides.getActiveIndex();
      if (ix == undefined) {
        ix = 0;
      }
      this.paginatedLocker = this.otherLockers[ ix ];
      this.getLockerContent(this.paginatedLocker);
    }
  }

  increaseSize() {
    this.paginatedLocker.increaseSize();
  }

  decreaseSize() {
    this.paginatedLocker.decreaseSize();
  }

  createLocker() {
    let editorModal = this.modalCtrl.create(LockerEditorPage, {}, {showBackdrop: false});
    editorModal.present();
  }

  private getLockerContent(locker: Locker) {
    this.cellarService.fetchLockerContent(locker).subscribe(
      (bottles: Bottle[]) => this.lockerContent=bottles
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

  expandRow(event: Event) {
    console.info();
  }

  cellSelected(cell: Cell) {
    if (cell) {
      if (this.pendingCell) {
        if (cell.id === this.pendingCell.id) {
          this.pendingCell = undefined;
          this.selectedCell.setSelected(false);
          this.selectedCell = undefined;
          return;
        }
        // une cellule était déjà sélectionnée qui contenait une bouteille
        // - déplacer cette bouteille dans la nouvelle cellule et déselectionner les 2 cellules
        // - si la nouvelle cellule contient aussi une bouteille alors la cellule sélectionnée devient cette
        // nouvelle cellule, sinon on déplace la bouteille et on déselectionne les 2 cellules
        let incomingCell = _.clone(cell);
        //on déplace la bouteille pré-enregistrée dans la cellule choisie
        cell.storeBottle(this.pendingCell.withdraw());
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

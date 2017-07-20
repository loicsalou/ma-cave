import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicPage, Slides} from 'ionic-angular';
import {SimpleLocker} from '../../model/simple-locker';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {Locker} from '../../model/locker';
import {Cell} from '../../components/locker/locker.component';
import {NotificationService} from '../../service/notification.service';
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
export class CellarPage implements OnInit {

  private otherLockers: Locker[];
  private chosenLocker: Locker;
  private paginatedLocker: Locker;
  @ViewChild(Slides) slides: Slides;

  pendingCell: Cell;
  pendingBottleTipVisible: boolean=false;

  constructor(private cellarService: CellarPersistenceService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.cellarService.allLockersObservable.subscribe(
      lockers => {
        this.otherLockers = lockers;
        this.resetPaginatedLocker();
      }
    );
    this.cellarService.fetchAllLockers();
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

  chooseLocker(locker: SimpleLocker) {
    if (this.chosenLocker !== undefined) {
      this.otherLockers.push(this.chosenLocker);
    }
    this.otherLockers = this.otherLockers.filter(item => item.name !== locker.name);
    this.chosenLocker = locker;
    this.resetPaginatedLocker();
  }

  showTip() {
    this.pendingBottleTipVisible=true;
    setTimeout(() => {
      this.pendingBottleTipVisible=false;
    }, 3000)
  }

  slideChanged() {
    this.resetPaginatedLocker();
  }

  cellSelected(selectedCell: Cell) {
    if (selectedCell) {
      if (this.pendingCell) {
        if (selectedCell.id === this.pendingCell.id) {
          this.pendingCell = undefined;
          selectedCell.setSelected(false);
          return;
        }
        // une cellule était déjà sélectionnée qui contenait une bouteille
        // - déplacer cette bouteille dans la nouvelle cellule et déselectionner les 2 cellules
        // - si la nouvelle cellule contient aussi une bouteille alors la cellule sélectionnée devient cette
        // nouvelle cellule, sinon on déplace la bouteille et on déselectionne les 2 cellules
        let incomingCell = _.clone(selectedCell);
        //on déplace la bouteille pré-enregistrée dans la cellule choisie
        selectedCell.storeBottle(this.pendingCell.withdraw());
        //plus de cellule sélectionnée
        this.pendingCell.setSelected(false);
        this.pendingCell = undefined;
        if (!incomingCell.isEmpty()) {
          this.pendingCell = incomingCell;
          this.pendingCell.setSelected(true);
        }
      } else {
        //aucune cellule n'était sélectionnée
        if (selectedCell.isEmpty()) {
          //cellule vide mais rien en transit ==> erreur
          this.notificationService.warning('La cellule sélectionnée est vide');
        } else {
          //nouvelle bouteille en transit ==> on marque la cellule comme en transit et on stocke localement
          selectedCell.setSelected(true);
          this.pendingCell = selectedCell;
        }
      }
    }
  }
}

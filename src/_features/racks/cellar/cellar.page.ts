import {AfterViewChecked, AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Content, ModalController, NavController, NavParams} from 'ionic-angular';
import {CellarPersistenceService} from '../../../service/cellar-persistence.service';
import {Bottle, Position} from '../../../model/bottle';
import {Dimension, Locker, LockerType} from '../../../model/locker';
import {NotificationService} from '../../../service/notification.service';
import {SimpleLocker} from '../../../model/simple-locker';
import {BottlePersistenceService} from '../../../service/bottle-persistence.service';
import {Cell} from '../../../components/locker/cell';
import * as _ from 'lodash';
import {NativeProvider} from '../../../providers/native/native';
import {BottleDetailPage} from '../../browse/bottle-detail/page-bottle-detail';
import {UpdateLockerPage} from '../update-locker/update-locker.page';
import {CreateLockerPage} from '../create-locker/create-locker.page';
import {ApplicationState} from '../../../app/state/app.state';
import {Store} from '@ngrx/store';
import {BottlesQuery} from '../../../app/state/bottles.state';
import {LogoutAction} from '../../../app/state/shared.actions';
import {
  BottlesActionTypes,
  EditLockerAction,
  LoadCellarAction,
  ResetBottleSelectionAction,
  UpdateBottlesAction,
  WithdrawBottleAction
} from '../../../app/state/bottles.actions';
import {Observable, Subject} from 'rxjs';
import {ScrollAnchorDirective} from '../../../components/scroll-anchor.directive';
import {filter, map, shareReplay, tap} from 'rxjs/operators';
import {DimensionOfDirective} from '../../../components/dimension-of.directive';
import {SimpleLockerComponent} from '../../../components/locker/simple-locker.component';

function shortenBottle(btl: Bottle) {
  return {
    npmCru: btl.nomCru,
    millesime: btl.millesime,
    positions: btl.positions
  };
}

/**
 * Generated class for the CellarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
             templateUrl: './cellar.page.html'
             // styleUrls:[ 'cellar.page.scss' ]
           })
export class CellarPage implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild(Content) content: Content;
  lockerNames: string[];
  lockersAndBottles$: Observable<{ lockers: Locker[], bottles: Bottle[] }>;
  selectedBottles$: Observable<Bottle[]>;
  pendingBottleTipVisible: boolean = false;
  selectedCell: Cell;
  bottlesToPlaceLocker: SimpleLocker;
  selectedBottles: Bottle[];
  pendingCell: Cell;
  dimensions$: { [ lockerId: string ]: Observable<Dimension> };
  dimensionsSubjects: { [ lockerId: string ]: Subject<Dimension> } = {};
  lockers$: Observable<Locker[]>;
  bottlesPerRack$: Observable<{ [ lockerId: string ]: Bottle[] }>;

  @ViewChild('placedLockerComponent') private placedLockerComponent: SimpleLockerComponent;
  @ViewChildren(ScrollAnchorDirective) private lockerRows: QueryList<ScrollAnchorDirective>;
  @ViewChildren(DimensionOfDirective) private containers: QueryList<DimensionOfDirective<Locker>>;

  private doWithAction: string;
  private somethingWasUpdated = false;
  private lastUpdated: Bottle;
  private mustInitScale = true;

  constructor(private navCtrl: NavController,
              private cellarService: CellarPersistenceService,
              private bottleService: BottlePersistenceService,
              private notificationService: NotificationService,
              private nativeProvider: NativeProvider,
              private modalCtrl: ModalController,
              private params: NavParams,
              private store: Store<ApplicationState>) {
    this.store.dispatch(new LoadCellarAction());
  }

  getContainerDimension$(locker: Locker): Observable<Dimension> {
    let subject = this.dimensionsSubjects[ locker.id ];
    if (!subject) {
      subject = new Subject();
      this.dimensionsSubjects[ locker.id ] = subject;
    }
    return subject.asObservable();
  }

  ngOnInit(): void {
    this.nativeProvider.feedBack();
    this.doWithAction = this.params.data[ 'action' ] ? this.params.data[ 'action' ].type : undefined;
    // si une action est demandée on récupère la sélection et on crée le nécessaire
    if (this.doWithAction == BottlesActionTypes.HighlightBottleSelectionActionType) {
      this.selectedBottles$ = this.store.select(BottlesQuery.getSelectedBottles).pipe(
        tap((bottles: Bottle[]) => {
          this.selectedBottles = bottles;
        })
      );
    }
    if (this.doWithAction == BottlesActionTypes.PlaceBottleSelectionActionType) {
      this.selectedBottles$ = this.store.select(BottlesQuery.getSelectedBottles).pipe(
        tap((bottles: Bottle[]) => {
          this.ensurePlaceLockerInitialized(bottles);
        }),
        map((bottles: Bottle[]) => {
          let ix = 0;
          return bottles.map((btl: Bottle) => {
            let bottle = new Bottle(btl);
            bottle.positions = [ ...btl.positions ];
            let nbBottles = bottle.quantite_courante - bottle.positions.length;
            for (let i = 0; i < nbBottles; i++) {
              let pos = new Position(this.bottlesToPlaceLocker.id, ix++, 0);
              bottle.positions.push(pos);
            }
            return bottle;
          });
        })
      );
    }
    // observable sur les lockers pour le template
    this.lockers$ = this.store.select(BottlesQuery.getLockers).pipe(
      filter((lockers: Locker[]) => lockers.length > 0),
      tap((lockers) => {
        this.lockerNames = lockers.map(locker => locker.name);
        this.mustInitScale = true;
      }),
      shareReplay()
    );
    // observable sur les bouteilles pour le template
    this.bottlesPerRack$ = this.store.select(BottlesQuery.getBottles).pipe(
      tap(bottles => {
        this.traceSavedReceived(bottles);
      }),
      map((bottles: Bottle[]) => bottles.filter(bottle => bottle.positions.length > 0)),
      map((bottles: Bottle[]) => {
        let bottlesPerRack: { [ lockerId: string ]: Bottle[] } = {};
        bottles.forEach(bottle => {
                          bottle.positions.forEach(pos => {
                            let rack = bottlesPerRack[ pos.lockerId ];
                            if (rack === undefined) {
                              rack = [];
                              bottlesPerRack[ pos.lockerId ] = rack;
                            }
                            rack.push(bottle);
                          });
                        }
        );
        return bottlesPerRack;
      }),
      shareReplay()
    )
    ;
  }

  ngAfterViewInit() {
    if (this.doWithAction === BottlesActionTypes.PlaceBottleSelectionActionType) {
      //this.showBottlesToPlace();
    }
  }

  ngAfterViewChecked() {
    if (this.mustInitScale && this.containers && this.containers.length > 0) {
      this.containers.forEach(
        container => {
          let lockerId = container.dimensionOf.id;
          let subject = this.dimensionsSubjects[ lockerId ];
          if (subject) {
            subject.next(container.getContainerSize());
            this.mustInitScale = false;
          }
        }
      );
    }
  }

  ionViewDidLeave() {
    //reset de la sélection si on a effectué un traitement demandé
    if (this.doWithAction === BottlesActionTypes.HighlightBottleSelectionActionType
      || this.doWithAction === BottlesActionTypes.PlaceBottleSelectionActionType
      && this.somethingWasUpdated) {
      this.store.dispatch(new ResetBottleSelectionAction());
    }
  }

  scrollTo(lockerName: string) {
    const scrollAnchor = this.lockerRows.find(row => row.scrollAnchor === lockerName);
    if (scrollAnchor) {
      const offset = scrollAnchor.ref.nativeElement[ 'offsetTop' ];
      if (offset) {
        this.content.scrollTo(0, offset, 200);
      }
    }
  }

  logout() {
    this.store.dispatch(new LogoutAction());
    this.navCtrl.popToRoot();
  }

  zoomOnBottle(pendingCell: Cell) {
    let bottle = this.pendingCell.bottle;
    //let zoomedBottles = this.getBottlesInRowOf(this._pendingCell);
    //this.navCtrl.push(BottleDetailPage, {bottleEvent: {bottles: zoomedBottles, bottle: bottle}});
    this.navCtrl.push(BottleDetailPage, {bottleEvent: {bottles: [ bottle ], bottle: bottle}});
    this.somethingWasUpdated = true;
  }

  withdraw(pendingCell: Cell) {
    let bottle = this.pendingCell.bottle;
    if (bottle) {
      this.lastUpdated = bottle;
      this.store.dispatch(new WithdrawBottleAction(bottle, pendingCell.position));
      this.somethingWasUpdated = true;
      this.pendingCell.setSelected(false);
      this.pendingCell = undefined;
      this.notificationService.information('messages.withdraw-complete');
    }
  }

  createLocker() {
    let editorModal = this.modalCtrl.create(CreateLockerPage, {}, {showBackdrop: false});
    editorModal.present();
    this.somethingWasUpdated = true;
  }

  updateLocker(locker) {
    this.nativeProvider.feedBack();
    this.store.dispatch(new EditLockerAction(locker));
    let editorModal = this.modalCtrl.create(UpdateLockerPage, {}, {showBackdrop: true});
    editorModal.present();
    this.somethingWasUpdated = true;
  }

  deleteLocker(locker: Locker) {
    this.notificationService.ask('app.confirm', 'app.delete-locker').subscribe(
      validated => {
        if (validated) {
          this.cellarService.deleteLocker(locker);
        }
      }
    );
  }

  showTip() {
    this.nativeProvider.feedBack();
    this.pendingBottleTipVisible = true;
    setTimeout(() => {
      this.pendingBottleTipVisible = false;
    }, 3000);
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

  private traceSavedReceived(bottles: Bottle[]) {
    if (this.lastUpdated) {
      let lastupdatedReceived = bottles.filter((btl: Bottle) => btl.id === this.lastUpdated.id);
      //console.info('saved:' + JSON.stringify(shortenBottle(this.lastUpdated)));
      //console.info('retrieved:' + JSON.stringify(shortenBottle(lastupdatedReceived[ 0 ])));
      //console.info('===============================================');
    }
  }

  private moveCellContentTo(source: Cell, target: Cell) {
    if (source) {
      let bottle = new Bottle(source.withdraw());
      bottle.positions = [ ...bottle.positions.filter(pos => !pos.equals(source.position)) ];
      source.setSelected(false);
      let highlight = false;
      if (this.doWithAction === BottlesActionTypes.HighlightBottleSelectionActionType) {
        highlight = this.isBottleToHighlight(bottle);
      }
      target.storeBottle(bottle, highlight);
      bottle.positions.push(target.position);
      this.lastUpdated = bottle;
      this.store.dispatch(new UpdateBottlesAction([ bottle ]));
      this.somethingWasUpdated = true;
    }
  }

  private isBottleToHighlight(bottle: Bottle) {
    if (this.selectedBottles) {
      let ret = this.selectedBottles.find(btl => btl.id === bottle.id) !== undefined;
      if (ret) {
        this.notificationService.debugAlert('highlighted: ' + bottle.nomCru);
      }
      return ret;
    }
    else {
      return false;
    }
  }

  /**
   * la sélection de bouteilles reçue doit être soit placée, soit highlightée.
   * Si le placement est demandé et que le locker de placement n'existe pas il faut le créer
   * @param {Bottle[]} bottles
   */
  private ensurePlaceLockerInitialized(bottles: Bottle[]) {
    if (!this.bottlesToPlaceLocker) {
      //première réception: créer le locker de placement, attendre que le composant correspondant soit créé
      let nbToBePlaced = bottles.reduce((total, btl) => {
        let ret = total + +btl.quantite_courante - btl.positions.length;
        return ret;
      }, 0);
      this.bottlesToPlaceLocker = new SimpleLocker('placedLocker', 'placedLocker', LockerType.simple, {
        x: nbToBePlaced,
        y: 1
      }, false);
    }
  }

  // creéer des positions dans le placedLocker pour qu'elles y apparaissent
  //private fillPlacedLocker() {
  //  this.selectedBottles.forEach((btl: Bottle) => {
  //    let bottle=new Bottle(btl);
  //    bottle.positions=[...btl.positions];
  //    let ix = 0;
  //    let nbBottles = bottle.quantite_courante - bottle.positions.length;
  //    for (let i = 0; i < nbBottles; i++) {
  //      let pos=new Position(this.bottlesToPlaceLocker.id, ix++, 0);
  //      bottle.positions.push(pos);
  //      this.placedLockerComponent.placeBottle(bottle, pos);
  //    }
  //  });
  //}
}

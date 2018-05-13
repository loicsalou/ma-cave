import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Content, ModalController, NavController, NavParams} from 'ionic-angular';
import {CellarPersistenceService} from '../../../service/cellar-persistence.service';
import {Bottle, Position} from '../../../model/bottle';
import {Dimension, Locker, LockerType} from '../../../model/locker';
import {SimpleLockerComponent} from '../../../components/locker/simple-locker.component';
import {NotificationService} from '../../../service/notification.service';
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
import {
  BottlesActionTypes,
  EditLockerAction,
  LoadCellarAction,
  ResetBottleSelectionAction,
  UpdateBottlesAction,
  WithdrawBottleAction
} from '../../../app/state/bottles.actions';
import {Observable} from 'rxjs/Observable';
import {logWarn} from '../../../utils';
import {ScrollAnchorDirective} from '../../../components/scroll-anchor.directive';
import {filter, shareReplay, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {DimensionOfDirective} from '../../../components/dimension-of.directive';
import {Subject} from 'rxjs/Subject';

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
export class CellarPage implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

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

  @ViewChild('placedLockerComponent') private placedLockerComponent: SimpleLockerComponent;
  @ViewChildren(ScrollAnchorDirective) private lockerRows: QueryList<ScrollAnchorDirective>;
  @ViewChildren(DimensionOfDirective) private containers: QueryList<DimensionOfDirective<Locker>>;

  private doWithAction: string;
  private selectedBottlesSubscription: Subscription;
  private somethingWasUpdated = false;
  private lastUpdated: Bottle;
  private lockers$: Observable<Locker[]>;
  private bottles$: Observable<Bottle[]>;

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
    if (this.doWithAction) {
      this.selectedBottlesSubscription = this.store.select(BottlesQuery.getSelectedBottles).pipe(
        tap((bottles: Bottle[]) => this.handleBottlesSelection(bottles, this.doWithAction)),
      ).subscribe();
      //this.selectedBottlesSubscription = this.selectedBottles$.subscribe();
    }
    this.lockers$ = this.store.select(BottlesQuery.getLockers).pipe(
      filter((lockers: Locker[]) => lockers.length > 0),
      tap((lockers) => {
        this.lockerNames = lockers.map(locker => locker.name);
      }),
      shareReplay()
    );
    this.bottles$ = this.store.select(BottlesQuery.getBottles).pipe(
      tap(bottles => this.traceSavedReceived(bottles)),
      shareReplay()
    );
  }

  ngAfterViewInit() {
    if (this.doWithAction === BottlesActionTypes.PlaceBottleSelectionActionType) {
      this.showBottlesToPlace();
    }
  }

  ngAfterViewChecked() {
    if (this.containers && this.containers.length > 0) {
      this.containers.forEach(
        container => {
          let lockerId = container.dimensionOf.id;
          let subject = this.dimensionsSubjects[ lockerId ];
          if (subject) {
            subject.next(container.getContainerSize());
          }
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.selectedBottlesSubscription) {
      this.selectedBottlesSubscription.unsubscribe();
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
  }

  withdraw(pendingCell: Cell) {
    let bottle = this.pendingCell.bottle;
    if (bottle) {
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
      console.info('saved:' + JSON.stringify(shortenBottle(this.lastUpdated)));
      console.info('retrieved:' + JSON.stringify(shortenBottle(lastupdatedReceived[ 0 ])));
      console.info('===============================================');
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
  private handleBottlesSelection(bottles: Bottle[], action: string) {
    switch (action) {
      case BottlesActionTypes.PlaceBottleSelectionActionType: {
        this.selectedBottles = bottles;
        if (!this.bottlesToPlaceLocker) {
          //première réception: créer le locker de placement, attendre que le composant correspondant soit créé
          let nbToBePlaced = bottles.reduce((total, btl) => {
            let ret = total + +btl.quantite_courante - btl.positions.length;
            return ret;
          }, 0);
          this.bottlesToPlaceLocker = new SimpleLocker(undefined, 'placedLocker', LockerType.simple, {
            x: nbToBePlaced,
            y: 1
          }, false);
        } else {
          //toutes les autres réceptions: rafraichir le composant
          this.showBottlesToPlace();
        }
        break;
      }

      case BottlesActionTypes.HighlightBottleSelectionActionType: {
        this.selectedBottles = bottles;
        break;
      }

      default:
        logWarn('Action non supportée ' + action);
    }
  }

  private showBottlesToPlace() {
    this.selectedBottles.forEach((bottle: Bottle) => {
      let ix = 0;
      let nbBottles = bottle.quantite_courante - bottle.positions.length;
      for (let i = 0; i < nbBottles; i++) {
        this.placedLockerComponent.placeBottle(bottle, new Position(undefined, ix++, 0));
      }
    });
  }
}

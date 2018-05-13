import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FabButton, FabList, MenuController, NavController} from 'ionic-angular';
import {Bottle, BottleState} from '../../../model/bottle';
import {BottleDetailPage} from '../bottle-detail/page-bottle-detail';
import {FilterSet} from '../../../components/distribution/filterset';
import {BottleItemComponent} from '../../../components/list/bottle-item.component';
import {NativeProvider} from '../../../providers/native/native';
import {Observable} from 'rxjs/Observable';
import {ApplicationState} from '../../../app/state/app.state';
import {Store} from '@ngrx/store';
import {BottlesQuery} from '../../../app/state/bottles.state';
import {
  HightlightBottleSelectionAction,
  PlaceBottleSelectionAction,
  ResetFilterAction,
  SetSelectedBottleAction,
  UpdateFilterAction
} from '../../../app/state/bottles.actions';
import {combineLatest, map, shareReplay, take, tap} from 'rxjs/operators';
import {SortOption} from '../../../components/distribution/distribution';
import {NotificationService} from '../../../service/notification.service';
import {CellarPage} from '../../racks/cellar/cellar.page';
import * as _ from 'lodash';

function sliceAround(currentBottles: Bottle[], bottle: Bottle, slice: number) {
  const ix = currentBottles.findIndex(btl => btl.id === bottle.id);
  const from = ix - slice;
  const to = ix + slice + 1;
  return currentBottles.slice(from < 0 ? 0 : from, to > currentBottles.length ? currentBottles.length : to);
}

@Component({
             selector: 'page-browse',
             templateUrl: 'browse.page.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class BrowsePage implements OnInit, OnDestroy {
  nbOfLots = 0;
  nbSelected = 0;

  bottleStates$: Observable<BottleState[]>;
  filterSet$: Observable<FilterSet>;
  @ViewChild(FabButton) ionFAB: FabButton;

  private nbOfBottles: number = 0;
  private searchBarVisible: boolean = false;
  private sortOption: SortOption;
  private currentBottles: Bottle[];

  constructor(public navCtrl: NavController,
              private menuController: MenuController,
              private nativeProvider: NativeProvider,
              private store: Store<ApplicationState>,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.nativeProvider.feedBack();
    this.filterSet$ = this.store.select(BottlesQuery.getFilter).pipe(
      tap((filterSet: FilterSet) => this.sortOption = filterSet.sortOption)
    );
    let bottles$ = this.store.select(BottlesQuery.getFilteredBottles).pipe(
      map((bottles: Bottle[]) => this.getPrepareDisplayedList(bottles))
    );
    let selection$ = this.store.select(BottlesQuery.getSelectedBottles);

    this.bottleStates$ = selection$.pipe(
      combineLatest(bottles$),
      map((result: [ Bottle[], Bottle[] ]) => {
        let ret = {selected: result[ 0 ], bottles: result[ 1 ]};
        this.nbSelected = ret.selected.length;
        return ret;
      }),
      map((selectedAndBottles: { selected: Bottle[], bottles: Bottle[] }) => {
        const selected = selectedAndBottles.selected;
        return selectedAndBottles.bottles.map(btl => {
          return {
            bottle: btl,
            selected: selected.findIndex(b => b.id === btl.id) !== -1
          };
        });
      }),
      shareReplay(1)
    );
  }

  ngOnDestroy() {
    if (this.ionFAB) {
      // TODO ne permet appremment pas de refermer les FAB boutons...
      //this.ionFAB.setActiveClose(true);
    }
  }

  anyBottleSelected(): boolean {
    return this.nbSelected > 0;
  }

  placeSelection() {
    // TODO ionic4: avec le router Angular l'action pourra déclencher une navigation dans l'Effect ngrx
    this.store.select(BottlesQuery.getSelectedBottles).pipe(
      take(1),
      map((bottles: Bottle[]) => bottles.filter(
        (bottle: Bottle) => bottle.positions.length < bottle.quantite_courante)
      )
    ).subscribe(
      (bottles: Bottle[]) => {
        if (bottles.length > 0) {
          this.navCtrl.push(CellarPage, {action: new PlaceBottleSelectionAction()});
        }
        else {
          this.notificationService.information('app.no-bottles-to-place');
        }
      }
    );
    if (this.ionFAB) {
      // TODO ne permet appremment pas de refermer les FAB boutons...
      //this.ionFAB.setActiveClose(true);
    }
  }

  locateSelection() {
    // TODO ionic4: avec le router Angular l'action pourra déclencher une navigation dans l'Effect ngrx
    this.store.select(BottlesQuery.getSelectedBottles).pipe(
      take(1),
      map((bottles: Bottle[]) => bottles.filter((bottle: Bottle) => bottle.positions.length > 0))
    ).subscribe(
      (bottles: Bottle[]) => {
        if (bottles.length > 0) {
          this.navCtrl.push(CellarPage, {action: new HightlightBottleSelectionAction()});
        }
        else {
          this.notificationService.information('app.no-bottles-placed');
        }
      }
    );
    if (this.ionFAB) {
      // TODO ne permet appremment pas de refermer les FAB boutons...
      //this.ionFAB.setActiveClose(true);
    }
  }

  registerSelectionAsFavorite() {
    this.notificationService.error('registerSelectionAsFavorite est à réimplémenter');
    // règle: si une seule n'est pas favorite on les met toutes en favorite, sinon on les sort des favorites
    //const atLeastOneNonFavorite = this.selectedBottles.filter(btl => !btl.favorite).length > 0;
    //const updatedBottles = this.selectedBottles.map(
    //  btl => {
    //    const updated = new Bottle(btl);
    //    updated.favorite = atLeastOneNonFavorite;
    //    return updated;
    //  }
    //);
    //
    //this.store.dispatch(new UpdateBottlesAction(updatedBottles));
    //this.resetSelection();
  }

  /**
   * prend en compte le nouvel état sélectionnée ou pas pour une bouteille
   * @param {bottle: Bottle; selected: boolean} event bouteille sélectionnée ou désélectionnée
   */
  switchSelected(event: { bottle: Bottle, selected: boolean }) {
    this.store.dispatch(new SetSelectedBottleAction(event.bottle, event.selected));
  }

  ionViewWillLeave() {
    this.menuController.close();
  }

  showSearchBar() {
    this.searchBarVisible = !this.searchBarVisible;
  }

  filterOnText(event: any) {
    let filter = event.target.value;
    this.store.dispatch(
      filter
        ? new UpdateFilterAction(new FilterSet(filter.split(' ')))
        : new ResetFilterAction()
    );
  }

  triggerDetail(bottle: Bottle) {
    this.navCtrl.push(BottleDetailPage,
                      {
                        bottleEvent: {
                          bottles: sliceAround(this.currentBottles, bottle, 10),
                          bottle: bottle
                        }
                      });
  }

  private getPrepareDisplayedList(received: Bottle[]): Bottle[] {
    this.nbOfLots = received.length;
    this.nbOfBottles = 0;
    if (received) {
      this.nbOfBottles = received.reduce(
        (tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0
      );
    }
    if (this.sortOption) {
      received = _.orderBy(received,
                           [ this.sortOption.sortOn, 'country_label', 'subregion_label', 'area_label', 'nomCru', 'millesime' ],
                           [ this.sortOption.sortOrder == undefined ? 'asc' : this.sortOption.sortOrder,
                             'asc', 'asc', 'asc', 'asc', 'asc' ]
      );
    } else {
      received = _.orderBy(received, [ 'quantite_courante', 'country_label', 'subregion_label',
        'area_label', 'nomCru', 'millesime' ], [ 'desc', 'asc', 'asc', 'asc', 'asc', 'asc' ]
      );
    }
    this.currentBottles = received;

    return received;
  }
}

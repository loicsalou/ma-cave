import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {Bottle} from '../../../model/bottle';
import {BottleDetailPage} from '../bottle-detail/page-bottle-detail';
import {FilterSet} from '../../../components/distribution/filterset';
import * as _ from 'lodash';
import {CellarPage} from '../../racks/cellar/cellar.page';
import {BottleItemComponent} from '../../../components/list/bottle-item.component';
import {NativeProvider} from '../../../providers/native/native';
import {Observable} from 'rxjs/Observable';
import {ApplicationState} from '../../../app/state/app.state';
import {Store} from '@ngrx/store';
import {BottlesQuery} from '../../../app/state/bottles.state';
import {
  ResetBottleSelectionAction,
  ResetFilterAction,
  SelectBottleAction,
  UpdateBottlesAction,
  UpdateFilterAction
} from '../../../app/state/bottles.actions';
import {map, tap} from 'rxjs/operators';
import {SortOption} from '../../../components/distribution/distribution';
import {Subscription} from 'rxjs/Subscription';

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
  selectedBottles: Bottle[] = [];

  bottles$: Observable<Bottle[]>;
  filterSet$: Observable<FilterSet>;
  @ViewChild('bottleList') listComponent: BottleItemComponent;

  private nbOfBottles: number = 0;
  private searchBarVisible: boolean = false;
  private selectionSub: Subscription;
  private sortOption: SortOption;
  private currentBottles: Bottle[];

  constructor(public navCtrl: NavController,
              private menuController: MenuController,
              private nativeProvider: NativeProvider,
              private store: Store<ApplicationState>) {
  }

  get nbSelected(): number {
    return this.selectedBottles.length;
  }

  ngOnInit() {
    this.nativeProvider.feedBack();
    this.filterSet$ = this.store.select(BottlesQuery.getFilter).pipe(
      tap((filterSet: FilterSet) => this.sortOption = filterSet.sortOption)
    );
    this.bottles$ = this.store.select(BottlesQuery.getFilteredBottles).pipe(
      map((bottles: Bottle[]) => this.getPrepareDisplayedList(bottles))
    );
    this.selectionSub = this.store.select(BottlesQuery.getSelectedBottles).subscribe(
      (bottles: Bottle[]) => this.selectedBottles = bottles
    );
  }

  ngOnDestroy() {
    this.selectionSub.unsubscribe();
  }

  anyBottleSelected(): boolean {
    return this.nbSelected > 0;
  }

  placeSelection() {
    this.navCtrl.push(CellarPage, {bottlesToPlace: this.selectedBottles});
    this.resetSelection();
  }

  locateSelection() {
    this.navCtrl.push(CellarPage, {bottlesToHighlight: this.selectedBottles});
    this.resetSelection();
  }

  registerSelectionAsFavorite() {
    // règle: si une seule n'est pas favorite on les met toutes en favorite, sinon on les sort des favorites
    const atLeastOneNonFavorite = this.selectedBottles.filter(btl => !btl.favorite).length > 0;
    const updatedBottles = this.selectedBottles.map(
      btl => {
        const updated = new Bottle(btl);
        updated.favorite = atLeastOneNonFavorite;
        return updated;
      }
    );

    this.store.dispatch(new UpdateBottlesAction(updatedBottles));
    this.resetSelection();
  }

  /**
   * prend en compte le nouvel état sélectionnée ou pas pour une bouteille
   * @param {bottle: Bottle; selected: boolean} event bouteille sélectionnée ou désélectionnée
   */
  switchSelected(event: { bottle: Bottle, selected: boolean }) {
    this.store.dispatch(new SelectBottleAction(event.bottle, event.selected));
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

  private resetSelection() {
    this.store.dispatch(new ResetBottleSelectionAction());
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

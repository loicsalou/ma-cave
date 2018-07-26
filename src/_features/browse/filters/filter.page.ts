import {Bottle, BottleState} from '../../../model/bottle';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {SortOption} from '../../../components/distribution/distribution';
import {MenuController} from '@ionic/angular';
import {Subscription, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../../app/state/app.state';
import {ResetFilterAction, UpdateFilterAction} from '../../../app/state/bottles.actions';
import {BottlesQuery} from '../../../app/state/bottles.state';
import {FilterSet} from '../../../components/distribution/filterset';
import {map, tap} from 'rxjs/operators';

@Component({
             selector: 'page-filter',
             templateUrl: 'filter.page.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class FilterPage implements OnInit, OnDestroy {

  public sortAxis = [
    {id: 'qty', name: 'Quantité', col: 'quantite_courante'},
    {id: 'vintage', name: 'Millésime', col: 'millesime'},
    {id: 'area', name: 'Région', col: 'area_label'}
  ];

  nbOfBottles: number = 0;
  filterSet: FilterSet;
  sortOn: string = 'country_label';
  ascending: boolean = true;
  bottles$: Observable<Bottle[]>;

  private filtersSub: Subscription;
  private nbLots = 0;

  constructor(private menuController: MenuController, private store: Store<ApplicationState>) {
  }

  ngOnInit(): void {
    this.filtersSub = this.store.select(BottlesQuery.getFilter).subscribe(
      filterSet => this.filterSet = Object.assign(new FilterSet(), filterSet)
    );
    this.bottles$ = this.store.select(BottlesQuery.getFilteredBottles).pipe(
      tap((bottles: Bottle[]) => {
        this.nbOfBottles = bottles.reduce((tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0);
        this.nbLots = bottles.length;
      })
    );
  }

  ngOnDestroy(): void {
    this.filtersSub.unsubscribe();
  }

  sort(axis: any) {
    if (axis !== undefined) {
      this.sortOn = axis.col ? axis.col : this.sortOn;
    }
    let sortOption: SortOption = {
      sortOn: axis == undefined ? this.sortOn : axis.col,
      sortOrder: (this.ascending ? 'asc' : 'desc')
    };
    this.filterSet.setSortOption(sortOption);
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  //ngOnChanges() {
  //  if (this.bottles) {
  //    this.nbOfBottles = this.bottles.reduce((tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0);
  //  }
  //}

  switchFavorite(event) {
    this.filterSet.switchFavorite();
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  switchOverdue(event) {
    this.filterSet.switchOverdue();
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  switchedPlaced(event) {
    this.filterSet.placed = event.checked;
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  switchedToBePlaced(event) {
    this.filterSet.toBePlaced = event.checked;
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  switchHistory(event) {
    this.filterSet.switchHistory();
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  //appelé depuis la page des distributions dans le but d'enrichir le filtre existant déjà
  refineFilter(filters: FilterSet) {
    // on prend ce qui vient de la distribution
    let newFilterSet = Object.assign(new FilterSet(), filters);
    // on récupère le filterset courant
    newFilterSet.text = this.filterSet.text;
    newFilterSet.history = this.filterSet.history;
    newFilterSet.placed = this.filterSet.placed;
    newFilterSet.toBePlaced = this.filterSet.toBePlaced;
    newFilterSet.favoriteOnly = this.filterSet.favoriteOnly;
    this.filterSet = newFilterSet;
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  getNbOfLots(): number {
    //return this.bottles == undefined ? 0 : this.bottles.length;
    return this.nbLots;
  }

  getNbOfBottles(): number {
    return this.nbOfBottles;
  }

  close() {
    this.menuController.close();
  }

  reset() {
    this.store.dispatch(new ResetFilterAction());
    this.menuController.close();
  }
}

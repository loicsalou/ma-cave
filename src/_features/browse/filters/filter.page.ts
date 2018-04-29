import {Bottle} from '../../../model/bottle';
import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FilterSet, SortOption} from '../../../components/distribution/distribution';
import {BottlePersistenceService} from '../../../service/bottle-persistence.service';
import {MenuController} from 'ionic-angular';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../../app/state/app.state';
import {ResetFilterAction, UpdateFilterAction} from '../../../app/state/filters.action';
import {FilterState} from '../../../app/state/filters.state';
import {BottlesQuery, BottlesState} from '../../../app/state/bottles.state';

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

  @Input()
  bottles: Observable<Bottle[]>;

  nbOfBottles: number = 0;
  filterSet: FilterSet;
  sortOn: string = 'country_label';
  ascending: boolean = true;
  private filtersSub: Subscription;
  private nbLots = 0;

  constructor(private menuController: MenuController, private store: Store<ApplicationState>) {
  }

  ngOnInit(): void {
    this.filtersSub = this.store.select(BottlesQuery.getFilter).subscribe(
      filterSet => this.filterSet = filterSet
    );
    this.bottles.subscribe(
      (bottles: Bottle[]) => {
        if (!bottles) {
          bottles = [];
        }
        this.nbOfBottles = bottles.reduce((tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0);
        this.nbLots = bottles.length;
      }
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
    this.filterSet = Object.assign(new FilterSet(), this.filterSet);
    this.filterSet.switchFavorite();
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  switchOverdue(event) {
    this.filterSet = Object.assign(new FilterSet(), this.filterSet);
    this.filterSet.switchOverdue();
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  switchedPlaced(event) {
    this.filterSet = Object.assign(new FilterSet(), this.filterSet);
    this.filterSet.placed = event.checked;
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  switchedToBePlaced(event) {
    this.filterSet = Object.assign(new FilterSet(), this.filterSet);
    this.filterSet.toBePlaced = event.checked;
    this.store.dispatch(new UpdateFilterAction(this.filterSet));
  }

  switchHistory(event) {
    this.filterSet = Object.assign(new FilterSet(), this.filterSet);
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
    this.filterSet.reset();
    this.menuController.close();
  }
}

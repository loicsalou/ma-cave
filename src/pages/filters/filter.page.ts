import {Bottle} from '../../model/bottle';
import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {FilterSet, SortOption} from '../../components/distribution/distribution';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {MenuController} from 'ionic-angular';
import {Subscription} from 'rxjs/Subscription';

@Component({
             selector: 'page-filter',
             templateUrl: 'filter.page.html'
           })
export class FilterPage implements OnInit, OnChanges, OnDestroy {

  public sortAxis = [
    {id: 'qty', name: 'Quantité', col: 'quantite_courante'},
    {id: 'vintage', name: 'Millésime', col: 'millesime'},
    {id: 'area', name: 'Région', col: 'area_label'}
  ]

  @Input()
  bottles: Bottle[];

  nbOfBottles: number = 0;
  filterSet: FilterSet;
  sortOn: string = 'country_label';
  ascending: boolean = true;
  private filtersSub: Subscription;

  constructor(private bottlesService: BottlePersistenceService, private menuController: MenuController) {
  }

  //ionViewWillLeave() {
  //  console.log("leaving FilterPage");
  //}
  ngOnInit(): void {
    this.filtersSub = this.bottlesService.filtersObservable.subscribe(
      filterSet => this.filterSet = filterSet
    );
  }

  ngOnDestroy(): void {
    this.filtersSub.unsubscribe();
  }

  sort(axis: any) {
    if (axis !== undefined) {
      this.sortOn = axis.col ? axis.col : this.sortOn
    }
    let sortOption: SortOption = {
      sortOn: axis == undefined ? this.sortOn : axis.col,
      sortOrder: (this.ascending ? 'asc' : 'desc')
    };
    this.filterSet.setSortOption(sortOption);
    this.bottlesService.filterOn(this.filterSet)
  }

  ngOnChanges() {
    if (this.bottles) {
      this.nbOfBottles = this.bottles.reduce((tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0);
    }
  }

  switchFavorite(event) {
    this.filterSet.switchFavorite();
    this.bottlesService.filterOn(this.filterSet);
  }

  switchOverdue(event) {
    this.filterSet.switchOverdue();
    this.bottlesService.filterOn(this.filterSet);
  }

  switchedPlaced(event) {
    this.filterSet.placed = event.checked;
    this.bottlesService.filterOn(this.filterSet);
  }

  switchedToBePlaced(event) {
    this.filterSet.toBePlaced = event.checked;
    this.bottlesService.filterOn(this.filterSet);
  }

  switchHistory(event) {
    this.filterSet.switchHistory();
    this.bottlesService.filterOn(this.filterSet);
  }

  //appelé depuis la page des filtres dnas le but d'enrichir le filtre textuel existant déjà si c'est le cas
  refineFilter(filters: FilterSet) {
    filters.text = this.filterSet.text;
    filters.history = this.filterSet.history;
    filters.placed = this.filterSet.placed;
    filters.toBePlaced = this.filterSet.toBePlaced;
    filters.favoriteOnly = this.filterSet.favoriteOnly;
    this.filterSet = filters;
    this.bottlesService.filterOn(filters);
  }

  getNbOfLots(): number {
    return this.bottles == undefined ? 0 : this.bottles.length;
  }

  getNbOfBottles(): number {
    return this.nbOfBottles;
  }

  close() {
    this.bottlesService.filterOn(this.filterSet);
    this.menuController.close();
  }

  reset() {
    this.filterSet.reset();
    this.bottlesService.filterOn(this.filterSet);
    this.menuController.close();
  }
}

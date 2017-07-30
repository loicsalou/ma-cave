import {Bottle} from '../../model/bottle';
import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {FilterSet} from '../../components/distribution/distribution';
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
  historyVisible = false;
  ascending: boolean = true;
  private filtersSub: Subscription;

  constructor(private bottlesService: BottlePersistenceService, private menuController: MenuController) {
  }

  ngOnInit(): void {
    this.filtersSub=this.bottlesService.filtersObservable.subscribe(
      filterSet => this.filterSet = filterSet
    );
  }

  ngOnDestroy(): void {
    this.filtersSub.unsubscribe();
  }

  sort(axis: any) {
    this.bottlesService.filterOn(this.filterSet, axis.col, (this.ascending ? 'asc' : 'desc'))
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

  switchToBePlaced(event) {
    this.filterSet.switchToBePlaced();
    this.bottlesService.filterOn(this.filterSet);
  }

  switchHistory(event) {
    this.filterSet.switchHistory();
    this.bottlesService.filterOn(this.filterSet);
  }

  //appelé depuis la page des filtres dnas le but d'enrichir le filtre textuel existant déjà si c'est le cas
  refineFilter(filters: FilterSet) {
    filters.text = this.filterSet.text;
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
    this.menuController.close();
  }

  reset() {
    this.filterSet.reset();
    this.bottlesService.fetchAllBottles();
    this.close();
  }
}

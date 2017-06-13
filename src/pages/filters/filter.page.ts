import {Bottle} from '../../components/bottle/bottle';
import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FilterSet} from '../../components/distribution/distribution';
import {BottleService} from '../../components/bottle/bottle-firebase.service';
import {MenuController} from 'ionic-angular';

@Component({
             selector: 'page-filter',
             templateUrl: 'filter.page.html'
           })
export class FilterPage implements OnInit, OnChanges {
  //public sortAxis = [ 'Quantité', 'Millésime', 'Région' ];

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

  constructor(private bottlesService: BottleService, private menuController: MenuController) {
  }

  ngOnInit(): void {
    this.bottlesService.filtersObservable.subscribe(
      filterSet => this.filterSet = filterSet
    );
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

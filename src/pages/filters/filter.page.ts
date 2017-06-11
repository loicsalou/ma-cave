import {Bottle} from '../../components/bottle/bottle';
import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {FilterSet} from '../../components/distribution/distribution';
import {BottleService} from '../../components/bottle/bottle-firebase.service';
import {MenuController} from 'ionic-angular';

@Component({
             selector: 'page-filter',
             templateUrl: 'filter.page.html'
           })
export class FilterPage implements OnInit, OnChanges {

  @Input()
  bottles: Bottle[];

  nbOfBottles: number=0;
  filterSet: FilterSet;
  historyVisible=false;

  constructor(private bottlesService: BottleService, private menuController: MenuController) {
  }

  ngOnInit(): void {
    this.bottlesService.filtersObservable.subscribe(
      filterSet => this.filterSet=filterSet
    );
  }

  ngOnChanges() {
    if (this.bottles) {
      this.nbOfBottles = this.bottles.reduce((tot:number, btl: Bottle) => tot+ +btl.quantite_courante, 0);
    }
  }

  switchFavorite(event) {
      this.filterSet.switchFavorite();
      this.refineFilter(this.filterSet);
  }

  switchHistory(event) {
      this.filterSet.switchHistory();
      this.refineFilter(this.filterSet);
  }

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
  }
}

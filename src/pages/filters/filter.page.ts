import {Bottle} from '../../components/bottle/bottle';
import {Component, Input} from '@angular/core';
import {FilterSet} from '../../components/distribution/distribution';
import {BottleService} from '../../components/bottle/bottle-firebase.service';
import {MenuController} from 'ionic-angular';

@Component({
             selector: 'page-filter',
             templateUrl: 'filter.page.html'
           })
export class FilterPage {

  @Input()
  bottles: Bottle[];

  filterSet: FilterSet;

  constructor(private bottlesService: BottleService, private menuController: MenuController) {
    this.filterSet = new FilterSet();
  }

  refineFilter(filters: FilterSet) {
    filters.text = this.filterSet.text;
    this.filterSet = filters;
    this.bottlesService.filterOn(filters);
  }

  nbOFBottles(): number {
    return this.bottles == undefined ? 0 : this.bottles.length;
  }

  close() {
    this.menuController.close();
  }

  reset() {
    this.filterSet.reset();
    this.bottlesService.fetchAllBottles();
  }
}

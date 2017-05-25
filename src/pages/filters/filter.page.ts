import {Bottle} from '../../components/bottle/bottle';
import {Component, Input} from '@angular/core';
import {FilterSet} from '../../components/distribution/distribution';
import {BottleService} from '../../components/bottle/bottle-firebase.service';

@Component({
             selector: 'page-filter',
             templateUrl: 'filter.page.html'
           })
export class FilterPage {

  @Input()
  bottles: Bottle[];

  filterSet: FilterSet;

  constructor(private bottlesService: BottleService) {
    this.filterSet = new FilterSet();
  }

  refineFilter(filters: FilterSet) {
    filters.text = this.filterSet.text;
    this.filterSet = filters;
    this.bottlesService.filterOn(filters);
  }

}

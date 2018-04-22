import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FilterSet} from '../distribution/distribution';

/**
 * Generated class for the CurrentDistributionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
             selector: 'current-filters',
             templateUrl: 'current-filters.html'
           })
export class CurrentFiltersComponent implements OnChanges {

  @Input() filterSet: FilterSet;

  translated: string[] = [];
  values: any[] = [];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.filterSet || ! changes.filterSet.currentValue) {
      return;
    }
    this.filterSet = changes.filterSet.currentValue;
    this.translated=[];
    this.values=[];

    if (this.filterSet.favoriteOnly) {
      this.translated.push(('filter.favorite-only'));
    }
    if (this.filterSet.overdueOnly) {
      this.translated.push('filter.overdue-only');
    }
    if (this.filterSet.hasText()) {
      this.values.push(this.filterSet.text);
    }
    if (this.filterSet.hasAppellations()) {
      this.values.push(this.filterSet.area_label);
    } else if (this.filterSet.hasRegions()) {
      this.values.push(this.filterSet.subregion_label);
    }
    if (this.filterSet.hasCouleurs()) {
      this.values.push(this.filterSet.label);
    }
    if (this.filterSet.hasMillesimes()) {
      this.values.push(this.filterSet.millesime);
    } else if (this.filterSet.hasAges()) {
      this.values.push(this.filterSet.classe_age);
    } else if (!this.filterSet.placed) {
      this.translated.push('filter.to-be-placed-only');
    } else if (!this.filterSet.toBePlaced) {
      this.translated.push('filter.placed-only');
    }
  }

}

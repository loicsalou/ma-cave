import {Component, Output, EventEmitter} from '@angular/core';
import {Criteria} from './criteria';
import * as _ from 'lodash';

/*
  Generated class for the FilterPanel component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'filter-panel',
  templateUrl: 'filter-panel.html'
})
export class FilterPanelComponent {
  @Output()
  filterOn: EventEmitter<Criteria> = new EventEmitter();

  filters: Criteria={regions:[], colors: []};

  constructor() {
  }

  applyFilters() {
    this.filterOn.emit(this.filters);
  }

  chooseArea(region: string) {
    if (region==='*') {
      this.filters.regions=[];
    } else {
      if (this.filters.regions.indexOf(region)==-1) {
        this.filters.regions.push(region);
      } else {
        _.pull(this.filters.regions,region);
      }
    }
  }

  chooseColor(color: string) {
    if (color==='*') {
      this.filters.colors=[];
    } else {
      if (this.filters.colors.indexOf(color)==-1) {
        this.filters.colors.push(color);
      } else {
        _.pull(this.filters.colors,color);
      }
    }
  }

}

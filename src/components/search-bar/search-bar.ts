import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FilterSet} from '../distribution/distribution';

/**
 * Generated class for the SearchBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
             selector: 'search-bar',
             templateUrl: 'search-bar.html'
           })
export class SearchBarComponent implements OnChanges {

  @Input() nbCrus: number | undefined;
  @Input() nbBottles: number | undefined;
  @Input() filterSet: FilterSet;

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  searchVisible = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.filterSet || !changes.filterSet.currentValue) {
      return;
    }
    this.filterSet = changes.filterSet.currentValue;
  }

  isSearchVisible(): boolean {
    return this.filterSet === undefined || this.searchVisible;
  }

  toggleSearchBar() {
    this.searchVisible = !this.searchVisible;
  }

  filterOnText(text: string) {
    this.change.emit(text);
    this.searchVisible = false;
  }
}

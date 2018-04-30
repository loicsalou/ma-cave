import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {DistributeService} from '../../service/distribute.service';
import {Bottle} from '../../model/bottle';
import {TranslateService} from '@ngx-translate/core';
import {SimpleChanges} from '@angular/core/src/metadata/lifecycle_hooks';
import {FilterSet} from './filterset';

/*
 Generated class for the Distribution component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
             selector: 'distribution',
             templateUrl: 'distribution.html'
           })
export class DistributionComponent implements OnChanges, OnInit {
//axes de distribution de la distribution courante
  static DEFAULT_AXIS = [ 'label', 'subregion_label', 'classe_age' ];
  @Input()
  opened = false;
  @Input()
  bottles: Bottle[];
  @Output()
  closed: EventEmitter<any> = new EventEmitter();
  @Output()
  badgeClicked: EventEmitter<any> = new EventEmitter();
  @Output()
  filterSetChanged: EventEmitter<FilterSet> = new EventEmitter();
  currentDistributionAxis: string[] = DistributionComponent.DEFAULT_AXIS;

  //distribution des bouteilles selon les axes retenus
  distribution;
  //état des filtres par axe à l'écran
  open = {};

  //filtres courant et valeurs sélectionnées
  filterSet: FilterSet = new FilterSet();
  //filterSet: FilterSet = new FilterSet(this.translateService);

  //nombre de bouteilles affichées à un instant t
  count: number;

  constructor(private distributionService: DistributeService, private translateService: TranslateService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bottles && changes.bottles.previousValue !== changes.bottles.currentValue) {
      this.refreshFilters();
      this.count = this.bottles ? this.bottles.length : 0;
    }
  }

  ngOnInit(): void {
    this.refreshFilters();
  }

  close() {
    this.closed.emit('close');
  }

  isFilterSelected(axis: string, value: string) {
    if (this.filterSet[ axis ]) {
      return _.indexOf(this.filterSet[ axis ], value) != -1;
    }

    return false;
  }

  clearAxis(axis: string) {
    this.filterSet[ axis ] = undefined;
  }

  valueClicked($event, axis: string) {
    axis = axis ? axis.trim() : '';
    let filterValue = $event.currentTarget.textContent.split(':')[ 0 ];
    filterValue = filterValue ? filterValue.trim() : '';
    //update filterSet
    this.filterSet = Object.assign(new FilterSet(), this.filterSet);
    if (!this.filterSet[ axis ]) {
      this.filterSet[ axis ] = [];
    }
    this.filterSet[ axis ] = _.xor(this.filterSet[ axis ], [ filterValue ]);
    this.checkSubFilters();
    this.filterSetChanged.emit(this.filterSet);
  }

  clearFilter(axis) {
    _.pull(this.currentDistributionAxis, axis);
    this.checkSubFilters();
  }

  //refresh filters based on used filters
  // for example when filtering on a region we can refine on appellation, when filtering on classe_age we can refine on
  // millesime etc.
  refreshFilters() {
    this.currentDistributionAxis = DistributionComponent.DEFAULT_AXIS;
    if (this.isFilteringOn('subregion_label')) {
      //if at least one region selected show appellation
      this.currentDistributionAxis.push('area_label');
      this.currentDistributionAxis = _.uniq(this.currentDistributionAxis);
    }

    if (this.isFilteringOn('classe_age')) {
      //if at least one region selected show appellation
      this.currentDistributionAxis.push('millesime');
      this.currentDistributionAxis = _.uniq(this.currentDistributionAxis);
    }

    this.checkSubFilters();
    this.distribution = this.distributionService.distributeBy(this.bottles, this.currentDistributionAxis);
    this.distribution.forEach(d => this.isOpen[ d.axis ]);
  }

  isOpen(axis: string) {
    if (this.open[ axis ] == undefined) {
      this.open[ axis ] = false;
    }
    return this.open[ axis ];
  }

  public switchDistribution(d: Distribution) {
    this.isOpen(d.axis) ? this.open[ d.axis ] = false : this.open[ d.axis ] = true;
  }

  isFilteringOn(axis: string) {
    return this.filterSet[ axis ] && this.filterSet[ axis ].length > 0;
  }

  private checkSubFilters() {
    if (!this.isFilteringOn('subregion_label')) {
      this.currentDistributionAxis = _.pull(this.currentDistributionAxis, 'area_label');
      this.filterSet.area_label = undefined;
    }

    if (!this.isFilteringOn('classe_age')) {
      this.currentDistributionAxis = _.pull(this.currentDistributionAxis, 'millesime');
      this.filterSet.millesime = undefined;
    }
  }
}

// jeu de filtres actifs de la distribution

export interface SortOption {
  sortOn: string;
  sortOrder: 'asc' | 'desc';
}

import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import * as _ from "lodash";
import {DistributeService} from "./distribute.service";
import {Bottle} from "../bottle/bottle";

/*
 Generated class for the Distribution component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
             selector: 'distribution',
             templateUrl: 'distribution.html',
             styleUrls: [ '/src/components/distribution/distribution.scss' ]
           })
export class DistributionComponent implements OnChanges, OnInit {
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

  //axes de distribution de la distribution courante
  static DEFAULT_AXIS = [ 'label', 'subregion_label', 'classe_age' ];
  currentDistributionAxis: string[] = DistributionComponent.DEFAULT_AXIS;

  //distribution des bouteilles selon les axes retenus
  distribution;

  //filtres courant et valeurs sélectionnées
  filterSet: FilterSet = new FilterSet();

  //nombre de bouteilles affichées à un instant t
  count: number;

  constructor(private distributionService: DistributeService) {
  }

  ngOnChanges() {
    this.refreshFilters();
    this.count = this.bottles ? this.bottles.length : 0;
  }

  ngOnInit(): void {
    this.refreshFilters();
  }

  close() {
    this.closed.emit("close");
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
    //let value = {value: filterValue, axis: axis};
    //this.badgeClicked.emit(value);
    //update filterSet
    if (!this.filterSet[ axis ]) {
      this.filterSet[ axis ] = [];
    }
    this.filterSet[ axis ] = _.xor(this.filterSet[ axis ], [ filterValue ]);
    this.checkSubFilters()
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
      this.currentDistributionAxis.push('millesime')
      this.currentDistributionAxis = _.uniq(this.currentDistributionAxis);
    }

    this.checkSubFilters();
    this.distribution = this.distributionService.distributeBy(this.bottles, this.currentDistributionAxis);
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
export class FilterSet {
  text?: string[];
  subregion_label?: string[];
  area_label?: string[];
  label?: string[];
  classe_age?: string[];
  millesime?: string[];

  constructor() {
  }

  hasText() {
    return this.text && this.text.length > 0;
  }

  hasRegions() {
    return this.subregion_label && this.subregion_label.length > 0;
  }

  hasAppellations() {
    return this.area_label && this.area_label.length > 0;
  }

  hasCouleurs() {
    return this.label && this.label.length > 0;
  }

  hasAges() {
    return this.classe_age && this.classe_age.length > 0;
  }

  hasMillesimes() {
    return this.millesime && this.millesime.length > 0;
  }

  isEmpty() {
    return (!this.hasText() && !this.hasAppellations() && !this.hasAges() && !this.hasCouleurs() && !this.hasMillesimes() && !this.hasRegions());
  }

  reset() {
    this.text = undefined;
    this.area_label = undefined;
    this.label = undefined;
    this.classe_age = undefined;
    this.millesime = undefined;
    this.subregion_label = undefined;
  }

  toString() {
    let strings = [];

    if (this.hasText()) {
      strings.push(this.text);
    }
    if (this.hasAppellations()) {
      strings.push(this.area_label);
    } else if (this.hasRegions()) {
      strings.push(this.subregion_label);
    }
    if (this.hasCouleurs()) {
      strings.push(this.label);
    }
    if (this.hasMillesimes()) {
      strings.push(this.millesime);
    } else if (this.hasAges()) {
      strings.push(this.classe_age);
    }

    return strings.reduce((s1, s2) => s1 + ' & ' + s2);
  }
}

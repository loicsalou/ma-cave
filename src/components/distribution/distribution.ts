import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {DistributeService} from '../../service/distribute.service';
import {Bottle} from '../../model/bottle';
import {TranslateService} from '@ngx-translate/core';

/*
 Generated class for the Distribution component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
             selector: 'distribution',
             templateUrl: 'distribution.html',
             styleUrls: [ '/distribution.scss' ]
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
  filterSet: FilterSet = new FilterSet(this.translateService);

  //nombre de bouteilles affichées à un instant t
  count: number;

  constructor(private distributionService: DistributeService, private translateService: TranslateService) {
  }

  ngOnChanges() {
    this.refreshFilters();
    this.count = this.bottles ? this.bottles.length : 0;
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
export class FilterSet {
  text?: string[];
  subregion_label?: string[];
  area_label?: string[];
  label?: string[];
  classe_age?: string[];
  millesime?: string[];
  history = false;

  constructor(private translateService: TranslateService) {
  }

  private _favoriteOnly = false;

  get favoriteOnly(): boolean {
    return this._favoriteOnly;
  }

  set favoriteOnly(value: boolean) {
    this._favoriteOnly = value;
  }

  private _overdueOnly = false;

  get overdueOnly(): boolean {
    return this._overdueOnly;
  }

  set overdueOnly(value: boolean) {
    this._overdueOnly = value;
  }

  private _placed = true;

  get placed(): boolean {
    return this._placed;
  }

  set placed(value: boolean) {
    this._placed = value;
  }

  private _toBePlaced = true;

  get toBePlaced(): boolean {
    return this._toBePlaced;
  }

  set toBePlaced(value: boolean) {
    this._toBePlaced = value;
  }

  private _sortOption: SortOption;

  get sortOption(): SortOption {
    return this._sortOption;
  }

  set sortOption(value: SortOption) {
    this._sortOption = value;
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

  switchHistory() {
    this.history = !this.history;
  }

  switchFavorite() {
    this._favoriteOnly = !this._favoriteOnly
  }

  switchOverdue() {
    this._overdueOnly = !this._overdueOnly
  }

  /**
   * empty si aucun filtrage en place susceptible de changer la liste chargée de la base.
   * A noter le "favoriteOnly" ne permet que de se concentrer sur les bouteilles favorites. Si il est à false one ne
   * se préoccupe pas du status favotire ou pas de la bouteille.
   * @returns {boolean}
   */
  isEmpty() {
    return (!this.favoriteOnly && !this.overdueOnly && !this.hasText() && !this.hasAppellations() && !this.hasAges() &&
      !this.hasCouleurs() && !this.hasMillesimes() && !this.hasRegions() && this.history && this._placed &&
      this._toBePlaced);
  }

  reset() {
    this.text = undefined;
    this.area_label = undefined;
    this.label = undefined;
    this.classe_age = undefined;
    this.millesime = undefined;
    this.subregion_label = undefined;
    this.favoriteOnly = false;
    this.overdueOnly = false;
    this.placed = true;
    this.toBePlaced = true;
  }

  toString() {
    return JSON.stringify(this, (prop, value) => {
      if (prop === 'translateService') {
        return ''
      } else {
        return value
      }
    });
  }

  toMessage() {
    let strings = [];

    if (this.favoriteOnly) {
      strings.push(this.translateService.instant('filter.favorite-only'));
    }
    if (this.overdueOnly) {
      strings.push(this.translateService.instant('filter.overdue-only'));
    }
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
    } else if (!this._placed) {
      strings.push(this.translateService.instant('filter.to-be-placed-only'))
    } else if (!this._toBePlaced) {
      strings.push(this.translateService.instant('filter.placed-only'))
    }
    if (strings.length == 0) {
      return '';
    } else {
      return strings.join('&');
    }
  }

  setSortOption(sortOption: SortOption) {
    this._sortOption = sortOption;
  }
}

export interface SortOption {
  sortOn: string;
  sortOrder: 'asc' | 'desc';
}

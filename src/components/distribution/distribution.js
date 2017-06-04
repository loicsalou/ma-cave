var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { DistributeService } from './distribute.service';
/*
 Generated class for the Distribution component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
var DistributionComponent = DistributionComponent_1 = (function () {
    function DistributionComponent(distributionService) {
        this.distributionService = distributionService;
        this.opened = false;
        this.closed = new EventEmitter();
        this.badgeClicked = new EventEmitter();
        this.filterSetChanged = new EventEmitter();
        this.currentDistributionAxis = DistributionComponent_1.DEFAULT_AXIS;
        //filtres courant et valeurs sélectionnées
        this.filterSet = new FilterSet();
    }
    DistributionComponent.prototype.ngOnChanges = function () {
        this.refreshFilters();
        this.count = this.bottles ? this.bottles.length : 0;
    };
    DistributionComponent.prototype.ngOnInit = function () {
        this.refreshFilters();
    };
    DistributionComponent.prototype.close = function () {
        this.closed.emit('close');
    };
    DistributionComponent.prototype.isFilterSelected = function (axis, value) {
        if (this.filterSet[axis]) {
            return _.indexOf(this.filterSet[axis], value) != -1;
        }
        return false;
    };
    DistributionComponent.prototype.clearAxis = function (axis) {
        this.filterSet[axis] = undefined;
    };
    DistributionComponent.prototype.valueClicked = function ($event, axis) {
        axis = axis ? axis.trim() : '';
        var filterValue = $event.currentTarget.textContent.split(':')[0];
        filterValue = filterValue ? filterValue.trim() : '';
        //let value = {value: filterValue, axis: axis};
        //this.badgeClicked.emit(value);
        //update filterSet
        if (!this.filterSet[axis]) {
            this.filterSet[axis] = [];
        }
        this.filterSet[axis] = _.xor(this.filterSet[axis], [filterValue]);
        this.checkSubFilters();
        this.filterSetChanged.emit(this.filterSet);
    };
    DistributionComponent.prototype.clearFilter = function (axis) {
        _.pull(this.currentDistributionAxis, axis);
        this.checkSubFilters();
    };
    //refresh filters based on used filters
    // for example when filtering on a region we can refine on appellation, when filtering on classe_age we can refine on
    // millesime etc.
    DistributionComponent.prototype.refreshFilters = function () {
        this.currentDistributionAxis = DistributionComponent_1.DEFAULT_AXIS;
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
    };
    DistributionComponent.prototype.isFilteringOn = function (axis) {
        return this.filterSet[axis] && this.filterSet[axis].length > 0;
    };
    DistributionComponent.prototype.checkSubFilters = function () {
        if (!this.isFilteringOn('subregion_label')) {
            this.currentDistributionAxis = _.pull(this.currentDistributionAxis, 'area_label');
            this.filterSet.area_label = undefined;
        }
        if (!this.isFilteringOn('classe_age')) {
            this.currentDistributionAxis = _.pull(this.currentDistributionAxis, 'millesime');
            this.filterSet.millesime = undefined;
        }
    };
    return DistributionComponent;
}());
//axes de distribution de la distribution courante
DistributionComponent.DEFAULT_AXIS = ['label', 'subregion_label', 'classe_age'];
__decorate([
    Input(),
    __metadata("design:type", Object)
], DistributionComponent.prototype, "opened", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], DistributionComponent.prototype, "bottles", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], DistributionComponent.prototype, "closed", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], DistributionComponent.prototype, "badgeClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], DistributionComponent.prototype, "filterSetChanged", void 0);
DistributionComponent = DistributionComponent_1 = __decorate([
    Component({
        selector: 'distribution',
        templateUrl: 'distribution.html',
        styleUrls: ['/src/components/distribution/distribution.scss']
    }),
    __metadata("design:paramtypes", [DistributeService])
], DistributionComponent);
export { DistributionComponent };
// jeu de filtres actifs de la distribution
var FilterSet = (function () {
    function FilterSet() {
    }
    FilterSet.prototype.hasText = function () {
        return this.text && this.text.length > 0;
    };
    FilterSet.prototype.hasRegions = function () {
        return this.subregion_label && this.subregion_label.length > 0;
    };
    FilterSet.prototype.hasAppellations = function () {
        return this.area_label && this.area_label.length > 0;
    };
    FilterSet.prototype.hasCouleurs = function () {
        return this.label && this.label.length > 0;
    };
    FilterSet.prototype.hasAges = function () {
        return this.classe_age && this.classe_age.length > 0;
    };
    FilterSet.prototype.hasMillesimes = function () {
        return this.millesime && this.millesime.length > 0;
    };
    FilterSet.prototype.isEmpty = function () {
        return (!this.hasText() && !this.hasAppellations() && !this.hasAges() && !this.hasCouleurs() && !this.hasMillesimes() && !this.hasRegions());
    };
    FilterSet.prototype.reset = function () {
        this.text = undefined;
        this.area_label = undefined;
        this.label = undefined;
        this.classe_age = undefined;
        this.millesime = undefined;
        this.subregion_label = undefined;
    };
    FilterSet.prototype.toString = function () {
        var strings = [];
        if (this.hasText()) {
            strings.push(this.text);
        }
        if (this.hasAppellations()) {
            strings.push(this.area_label);
        }
        else if (this.hasRegions()) {
            strings.push(this.subregion_label);
        }
        if (this.hasCouleurs()) {
            strings.push(this.label);
        }
        if (this.hasMillesimes()) {
            strings.push(this.millesime);
        }
        else if (this.hasAges()) {
            strings.push(this.classe_age);
        }
        if (strings.length == 0) {
            return '';
        }
        else {
            return strings.reduce(function (s1, s2) { return s1 + ' & ' + s2; });
        }
    };
    return FilterSet;
}());
export { FilterSet };
var DistributionComponent_1;
//# sourceMappingURL=distribution.js.map
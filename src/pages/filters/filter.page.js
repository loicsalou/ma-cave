var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { FilterSet } from '../../components/distribution/distribution';
import { BottleService } from '../../components/bottle/bottle-firebase.service';
import { MenuController } from 'ionic-angular';
var FilterPage = (function () {
    function FilterPage(bottlesService, menuController) {
        this.bottlesService = bottlesService;
        this.menuController = menuController;
        this.filterSet = new FilterSet();
    }
    FilterPage.prototype.refineFilter = function (filters) {
        filters.text = this.filterSet.text;
        this.filterSet = filters;
        this.bottlesService.filterOn(filters);
    };
    FilterPage.prototype.nbOFBottles = function () {
        return this.bottles == undefined ? 0 : this.bottles.length;
    };
    FilterPage.prototype.close = function () {
        this.menuController.close();
    };
    FilterPage.prototype.reset = function () {
        this.filterSet.reset();
        this.bottlesService.fetchAllBottles();
    };
    return FilterPage;
}());
__decorate([
    Input(),
    __metadata("design:type", Array)
], FilterPage.prototype, "bottles", void 0);
FilterPage = __decorate([
    Component({
        selector: 'page-filter',
        templateUrl: 'filter.page.html'
    }),
    __metadata("design:paramtypes", [BottleService, MenuController])
], FilterPage);
export { FilterPage };
//# sourceMappingURL=filter.page.js.map
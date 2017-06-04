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
import { Bottle } from '../../bottle/bottle';
import { Configuration } from '../../config/Configuration';
/*
 Generated class for the BottleItemComponent component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
var BottleItemComponent = (function () {
    function BottleItemComponent() {
        this.showDetail = new EventEmitter();
    }
    BottleItemComponent.prototype.setClasses = function () {
        return Configuration.colorsText2Code[this.bottle['label']];
    };
    BottleItemComponent.prototype.triggerDetail = function (event) {
        this.showDetail.emit(this.bottle);
    };
    return BottleItemComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Bottle)
], BottleItemComponent.prototype, "bottle", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], BottleItemComponent.prototype, "showDetail", void 0);
BottleItemComponent = __decorate([
    Component({
        selector: 'bottle-item',
        templateUrl: 'bottle-item.component.html',
        styleUrls: ['/scr/components/list/bottle-item-component/bottle-item.component.scss']
    }),
    __metadata("design:paramtypes", [])
], BottleItemComponent);
export { BottleItemComponent };
//# sourceMappingURL=bottle-item.component.js.map
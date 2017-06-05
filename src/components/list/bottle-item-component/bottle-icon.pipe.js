var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
import { Configuration } from '../../config/Configuration';
/*
 * get the icon matching the wine
 */
var BottleIconPipe = (function () {
    function BottleIconPipe() {
    }
    BottleIconPipe.prototype.transform = function (value) {
        var color = this.getColor(value);
        return 'assets/img/bottle-color/bouteille' + color + '.png';
    };
    BottleIconPipe.prototype.getColor = function (label) {
        var ret = '-' + Configuration.colorsText2Code[label];
        return ret;
    };
    return BottleIconPipe;
}());
BottleIconPipe = __decorate([
    Pipe({
        name: 'bottleIcon'
    })
], BottleIconPipe);
export { BottleIconPipe };
//# sourceMappingURL=bottle-icon.pipe.js.map
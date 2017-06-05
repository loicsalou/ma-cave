var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by loicsalou on 25.05.17.
 */
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-uuid';
/**
 * Instanciation des bouteilles.
 * Cette factory en profite pour ajouter des attributs à la volée:
 * - un ID qui n'existe pas (pas encore) dans la DB
 * - une tranche d'âge, jeune, moyen, vieux, très vieux... pour le filtrage
 */
var BottleFactory = (function () {
    function BottleFactory(i18n) {
        this.i18n = i18n;
        this.currentYear = new Date().getFullYear();
    }
    BottleFactory.prototype.create = function (btl) {
        this.checkId(btl).setClasseAge(btl);
        return btl;
    };
    BottleFactory.prototype.setClasseAge = function (bottle) {
        if (bottle.millesime === '-') {
            bottle['classe_age'] = this.i18n.instant('no-age');
            return;
        }
        var mill = Number(bottle.millesime);
        if (mill + 4 > this.currentYear) {
            bottle['classe_age'] = this.i18n.instant('young');
        }
        if (mill + 10 > this.currentYear) {
            bottle['classe_age'] = this.i18n.instant('middle');
        }
        if (mill + 15 > this.currentYear) {
            bottle['classe_age'] = this.i18n.instant('old');
        }
        bottle['classe_age'] = this.i18n.instant('very-old');
        return this;
    };
    BottleFactory.prototype.checkId = function (bottle) {
        if (bottle.id == undefined || bottle.id == null) {
            bottle['id'] = UUID.UUID();
        }
        return this;
    };
    return BottleFactory;
}());
BottleFactory = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [TranslateService])
], BottleFactory);
export { BottleFactory };
//# sourceMappingURL=bottle.factory.js.map
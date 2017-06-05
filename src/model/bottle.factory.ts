/**
 * Created by loicsalou on 25.05.17.
 */
import {Injectable} from '@angular/core';
import {Bottle} from '../components/bottle/bottle';
import {TranslateService} from '@ngx-translate/core';
import {UUID} from 'angular2-uuid';
import {Statistics} from '../components/bottle/statistics';

/**
 * Instanciation des bouteilles.
 * Cette factory en profite pour ajouter des attributs à la volée:
 * - un ID qui n'existe pas (pas encore) dans la DB
 * - une tranche d'âge, jeune, moyen, vieux, très vieux... pour le filtrage
 */
@Injectable()
export class BottleFactory {
  currentYear = new Date().getFullYear();

  constructor(private i18n: TranslateService, private _stats: Statistics) {
  }

  public create(btl: Bottle): Bottle {
    this.checkId(btl).setClasseAge(btl).updateStats(btl);

    return btl;
  }

  get stats(): Statistics {
    return this._stats;
  }

  private setClasseAge(bottle: Bottle): BottleFactory {
    if (bottle.millesime === '-') {
      bottle[ 'classe_age' ] = this.i18n.instant('no-age');
      return this;
    }
    let mill = Number(bottle.millesime);
    if (mill + 4 > this.currentYear) {
      bottle[ 'classe_age' ] = this.i18n.instant('young');
    } else if (mill + 10 > this.currentYear) {
      bottle[ 'classe_age' ] = this.i18n.instant('middle');
    } else if (mill + 15 > this.currentYear) {
      bottle[ 'classe_age' ] = this.i18n.instant('old');
    } else {
      bottle[ 'classe_age' ] = this.i18n.instant('very-old');
    }

    return this;
  }

  private checkId(bottle: Bottle): BottleFactory {
    if (bottle.id == undefined || bottle.id == null) {
      bottle[ 'id' ] = UUID.UUID();
    }
    return this;
  }

  private updateStats(bottle: Bottle): BottleFactory {
    this._stats.updateFrom(bottle);
    return this;
  }
}

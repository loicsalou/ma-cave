/**
 * Created by loicsalou on 25.05.17.
 */
import {Injectable} from '@angular/core';
import {Bottle, Position} from './bottle';
import {TranslateService} from '@ngx-translate/core';
import {Statistics} from './statistics';
import {BottleIconPipe} from '../components/list/bottle-item-component/bottle-icon.pipe';

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

  public create(bottle: Bottle): Bottle {
    let btl: Bottle=new Bottle(bottle);
    this.setClasseAge(btl).setDefaultImage(btl).ensurePositionsInitialized(btl).mapPositions(btl);

    return btl;
  }

  get stats(): Statistics {
    return this._stats;
  }

  private ensurePositionsInitialized(btl: Bottle): BottleFactory {
    if (!btl.positions) {
      btl.positions = [];
    }
    return this;
  }

  private setDefaultImage(bottle: Bottle): BottleFactory {
    bottle.defaultImage = BottleIconPipe.prototype.transform(bottle.label);
    return this;
  }

  private mapPositions(bottle: Bottle): BottleFactory {
    bottle.positions = bottle.positions.map(pos => new Position(pos.lockerId, pos.x, pos.y, pos.rack));
    return this;
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
}

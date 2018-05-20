/**
 * Created by loicsalou on 25.05.17.
 */
import {Inject, Injectable} from '@angular/core';
import {Bottle, Position} from './bottle';
import {TranslateService} from '@ngx-translate/core';
import {logInfo} from '../utils';

/**
 * Instanciation des bouteilles.
 * Cette factory en profite pour ajouter des attributs à la volée:
 * - un ID qui n'existe pas (pas encore) dans la DB
 * - une tranche d'âge, jeune, moyen, vieux, très vieux... pour le filtrage
 */
@Injectable()
export class BottleFactory {
  currentYear = new Date().getFullYear();
  supportedBottleFields: string[] = [
    'id',
    'classe_age',
    'favorite',
    'area_label',
    'canal_vente',
    'comment',
    'cote',
    'country_label',
    'date_achat',
    'garde_max',
    'garde_min',
    'garde_optimum',
    'label',
    'lastUpdated',
    'lieu_achat',
    'millesime',
    'nomCru',
    'positions',
    'prix',
    'profile_image_url',
    'image_urls',
    'quantite_achat',
    'quantite_courante',
    'subregion_label',
    'suggestion',
    'volume',
    'metadata',
    'defaultImage',
    'overdue'
  ];

  constructor(private i18n: TranslateService, @Inject('GLOBAL_CONFIG') protected config) {
  }

  getImage(bottle: Bottle): string {
    const color = bottle.label === undefined ? 'undefined' : this.config.colorsText2Code[ bottle.label.toLowerCase() ];
    return 'assets/img/bottle-color/' + color + '.png';
  }

  public create(bottle: Bottle): Bottle {
    let btl: Bottle = new Bottle(bottle);
    this.setClasseAge(btl)
      .setDefaultImage(btl)
      .ensurePositionsInitialized(btl)
      .mapPositions(btl)
      .ensureDataTypes(btl)
      .setOverdue(btl);

    return btl;
  }

  /**
   * retourne les bouteilles qui contiennent un champ invalide
   * @param {Bottle[]} bottles
   */
  validate(bottles: Bottle[]): { bottle: Bottle, unsupportedAttrs: string[] }[] {
    const ret = bottles.map(bottle => {
      const attrs = Object.getOwnPropertyNames(bottle);
      const unsupported = attrs.filter(
        attr => this.supportedBottleFields.indexOf(attr) === -1
      );
      return {bottle: bottle, unsupportedAttrs: unsupported};
    }).filter(
      (result: { bottle: Bottle, unsupportedAttrs: string[] }) => result.unsupportedAttrs.length > 0
    );

    return ret;
  }

  fixBottles(bugs: { bottle: Bottle, unsupportedAttrs: string[] }[]): Bottle[] {
    let bottles: Bottle[] = bugs.map(
      bug => {
        let bottle = bug.bottle;
        let unsup = bug.unsupportedAttrs;
        unsup.forEach(attr => delete bottle[ attr ]);
        return bottle;
      }
    );
    return bottles;
  }

  private ensureDataTypes(btl: Bottle): BottleFactory {
    if (!btl.quantite_courante) {
      btl.quantite_courante = 0;
    }
    if (!btl.quantite_achat) {
      btl.quantite_achat = '0';
    }
    return this;
  }

  private ensurePositionsInitialized(btl: Bottle): BottleFactory {
    if (!btl.positions) {
      btl.positions = [];
    }
    return this;
  }

  private setDefaultImage(bottle: Bottle): BottleFactory {
    bottle.defaultImage = this.getImage(bottle);
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

  private setOverdue(bottle: Bottle): BottleFactory {
    if (bottle.millesime !== '-') {
      bottle.overdue = +bottle.millesime + +bottle.garde_max <= this.currentYear;
    } else {
      bottle.overdue = false;
    }

    return this;
  }
}

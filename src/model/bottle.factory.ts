/**
 * Created by loicsalou on 25.05.17.
 */
import {Injectable} from "@angular/core";
import {Bottle} from "../components/bottle/bottle";
import {TranslateService} from "@ngx-translate/core";
import {UUID} from "angular2-uuid";

/**
 * Instanciation des bouteilles.
 * Cette factory en profite pour ajouter des attributs à la volée:
 * - un ID qui n'existe pas (pas encore) dans la DB
 * - une tranche d'âge, jeune, moyen, vieux, très vieux... pour le filtrage
 */
@Injectable()
export class BottleFactory {

  currentYear = new Date().getFullYear();

  constructor(private i18n: TranslateService) {
  }

  public create(btl: Bottle): Bottle {
    this.checkId(btl).setClasseAge(btl);

    return btl;
  }

  private setClasseAge(bottle: Bottle): BottleFactory {
    if (bottle.millesime === '-') {
      bottle[ 'classe_age' ] = this.i18n.instant('no-age');
      return;
    }
    let mill = Number(bottle.millesime);
    if (mill + 4 > this.currentYear) {
      bottle[ 'classe_age' ] = this.i18n.instant('young');
    }
    if (mill + 10 > this.currentYear) {
      bottle[ 'classe_age' ] = this.i18n.instant('middle');
    }
    if (mill + 15 > this.currentYear) {
      bottle[ 'classe_age' ] = this.i18n.instant('old');
    }
    bottle[ 'classe_age' ] = this.i18n.instant('very-old');

    return this;
  }

  private checkId(bottle: Bottle): BottleFactory {
    if (bottle.id == undefined || bottle.id == null) {
      bottle[ 'id' ] = UUID.UUID();
    }
    return this;
  }
}

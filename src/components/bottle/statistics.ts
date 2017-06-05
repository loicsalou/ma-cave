import {Bottle} from './bottle';
import {Injectable} from '@angular/core';
/**
 * Created by loicsalou on 01.03.17.
 */
@Injectable()
export class Statistics {
  by_classe_age: Map<string, number> = new Map();
  by_area_label: Map<string, number> = new Map();
  by_country_label: Map<string, number> = new Map();
  by_label: Map<string, number> = new Map();
  by_millesime: Map<string, number> = new Map();
  by_nomCru: Map<string, number> = new Map();
  by_prix: Map<string, number> = new Map();
  by_subregion_label: Map<string, number> = new Map();
  by_volume: Map<string, number> = new Map();

  totalNumberOfBottles=0;

  public updateFrom(btl: Bottle) {
    if (! isNaN(+btl.quantite_courante) && +btl.quantite_courante>0) {
      let nbBottles=+btl.quantite_courante;
      this.totalNumberOfBottles+=nbBottles;
      this.update(this.by_classe_age, btl.classe_age,nbBottles);
      this.update(this.by_area_label, btl.area_label,nbBottles);
      this.update(this.by_country_label, btl.country_label,nbBottles);
      this.update(this.by_label, btl.label,nbBottles);
      this.update(this.by_millesime, btl.millesime,nbBottles);
      this.update(this.by_nomCru, btl.nomCru,nbBottles);
      this.update(this.by_prix, this.getPriceCategory(btl.prix),nbBottles);
      this.update(this.by_subregion_label, btl.subregion_label,nbBottles);
      this.update(this.by_volume, btl.volume,nbBottles);
    }
  }

  private getPriceCategory(prix: string): string {
    if (isNaN(+prix)) {
      return '-';
    }
    if (+prix < 10) {
      return 'pas-cher';
    }
    if (+prix < 20) {
      return 'correct';
    }
    if (+prix < 30) {
      return 'moyen';
    }
    if (+prix < 50) {
      return 'assez-cher';
    }
    return 'cher';
  }

  private update(category: Map<string, number>, axis: string, nbBottles: number) {
    if (!category.get(axis)) {
      category.set(axis, 0);
    }
    category.set(axis, category.get(axis) + nbBottles);
  }
}

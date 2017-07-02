/**
 * Created by loicsalou on 01.03.17.
 */
import * as _ from 'lodash';
import {ImgDefaultable} from '../directives/default-image/img-defaultable';

export class Bottle implements ImgDefaultable {

  private static SPECIAL_CHARS_REMOVED = new RegExp(/[\.|\d|\n|\r|,|!|?|@]/g);

  id?: string;
  classe_age?: string;
  favorite?: boolean;
  area_label: string;
  canal_vente: string;
  comment: string;
  cote: string;
  country_label: string;
  date_achat: string;
  garde_max: string;
  garde_min: string;
  garde_optimum: string;
  label: string;
  lieu_achat: string;
  millesime: string;
  nomCru: string;
  prix: string;
  profile_image_url?: string;
  image_urls?: string[];
  quantite_achat: string;
  quantite_courante: string;
  subregion_label: string;
  suggestion: string;
  volume: string;
  metadata?: BottleMetadata;
  defaultImage ?: string;

  getDefaultImageSrc(): string {
    return;
  }

  public static getMetadata(bottle: Bottle | any): BottleMetadata {
    let keywords = [];
    keywords.push(Bottle.extractKeywords(bottle.comment));
    keywords.push(Bottle.extractKeywords(bottle.suggestion));
    keywords.push(Bottle.extractKeywords(bottle.area_label));
    keywords.push(Bottle.extractKeywords(bottle.label));
    keywords.push(Bottle.extractKeywords(bottle.subregion_label));
    keywords = _.uniq(_.flatten(keywords));

    return {
      area_label: bottle.area_label,
      nomCru: bottle.nomCru,
      subregion_label: bottle.subregion_label,
      keywords: keywords
    }
  }

  private static extractKeywords(text: string): string[] {
    if (text) {
      let ret = text.replace(Bottle.SPECIAL_CHARS_REMOVED, ' ');
      return ret
        .split(' ')
        .filter(keyword => keyword.length > 2)
        .map(keyword => keyword.toLowerCase());
    } else {
      return []
    }
  }
}

export interface BottleMetadata {
  area_label: string;
  nomCru: string;
  subregion_label: string;
  keywords: string[];
}

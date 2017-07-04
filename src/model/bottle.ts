/**
 * Created by loicsalou on 01.03.17.
 */
import {ImgDefaultable} from '../directives/default-image/img-defaultable';

export class Bottle implements ImgDefaultable {

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
    return this.defaultImage;
  }
}

export interface BottleMetadata {
  area_label: string;
  area_label_search: string;
  nomCru: string;
  subregion_label: string;
  keywords: string[];
}

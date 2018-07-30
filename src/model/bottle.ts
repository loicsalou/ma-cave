import {BottleMetadata} from './bottle-metadata';
import {BottlePosition} from './bottle-position';

export class Bottle {
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
  lastUpdated: number;
  lieu_achat: string;
  millesime: string;
  nomCru: string;
  prix: string;
  profile_image_url?: string;
  image_urls?: string[];
  quantite_achat: string;
  quantite_courante: number;
  subregion_label: string;
  suggestion: string;
  volume: string;
  metadata?: BottleMetadata;
  defaultImage ?: string;
  overdue?: boolean;
  positions?: BottlePosition[]; // positions auxquelles les bouteilles du lot sont placées

  constructor(jsonOrBottle: Object) {
    Object.assign(this, jsonOrBottle);
  }
}


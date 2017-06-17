/**
 * Created by loicsalou on 01.03.17.
 */
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

  totalNumberOfBottles = 0;
}

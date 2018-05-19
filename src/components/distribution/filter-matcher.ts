import {Bottle} from '../../model/bottle';
import {FilterSet} from './filterset';

/**
 * Returns bottles that match ALL filters.
 * <li>all filters must be satisfied: filtered list is refined for each new filter</li>
 * <li>for each value in filter, applies a "OR" between accepted values</li>
 * @param filters
 * @returns {any}
 */
export function match(filter: FilterSet, btl: Bottle): boolean {

  if (!btl) {
    return false;
  }

  if (!filter.history && +btl.quantite_courante === 0) {
    return false;
  }

  if (filter.overdueOnly && !btl.overdue) {
    return false;
  }
  if (filter.favoriteOnly && !btl.favorite) {
    return false;
  }

  // ne pas montrer les bouteilles qui sont placées: si toutes les bouteilles du lot sont placées on ne garde pas
  if (!filter.placed && btl.positions.length === +btl.quantite_courante) {
    return false;
  }

  // ne pas montrer les bouteilles non placées
  // si le lot de ce cru est totalement placé on ne le garde pas
  if (!filter.toBePlaced && btl.positions.length !== +btl.quantite_courante) {
    return false;
  }

  if (filter.hasCouleurs()) {
    if (!checkAttributeIn(btl, 'label', filter.label)) {
      return false;
    }
  }

  // sur les axes de filtrage hiérarchiques comme les régions, les âges, on filtre sur l'axe le plus fin disponible
  if (filter.hasMillesimes()) {
    const attrValue = btl.millesime ? btl.millesime.toString() : '';
    if (!checkAttributeIn(btl, 'millesime', filter.millesime)) {
      return false;
    }
  } else {
    // if filtering on millesime no need to filter on ages (matching millesime implies matching ages slice)
    if (filter.hasAges()) {
      if (!checkAttributeIn(btl, 'classe_age', filter.classe_age)) {
        return false;
      }
    }
  }

  // on hierarchical axis like regions and ages, use most precise filter if available
  if (filter.hasAppellations()) {
    if (!checkAttributeIn(btl, 'area_label', filter.area_label)) {
      return false;
    }
  } else {
    // if filtering on area_label no need to filter on region (matching area_label implies matching subregion_label)
    if (filter.hasRegions()) {
      if (!checkAttributeIn(btl, 'subregion_label', filter.subregion_label)) {
        return false;
      }
    }
  }

  if (filter.hasText()) {
    if (!checkKeywords(btl, filter.text)) {
      return false;
    }
  }

  return true;
}

/**
 * searches through the given bottles all that match all of the filters passed in
 * @param fromList array of bottles
 * @param keywords an array of searched keywords
 * @returns array of matching bottles
 */
function checkKeywords(bottle: Bottle, keywords: string[]): boolean {
  if (!keywords || keywords.length == 0) {
    return true;
  }
  //TODO veiller à stocker les filtres en lowercase pour ne pas refaire ce toLowerCase autant de fois qu'on a de
  // bouteilles
  keywords = keywords.map(
    kw => {
      return kw.trim().toLowerCase();
    }
  );

  let found = true;
  let i = 0;

  while (i < keywords.length && found) {
    found = checkKeyword(bottle, keywords[ i++ ]);
  }

  return found;
}

function checkKeyword(bottle: Bottle, keyword: string): boolean {
  const values = Object.keys(bottle)
    .map(k => bottle[ k ])
    .filter(v => v && typeof(v) === 'string')
    .map((v: string) => v.toLocaleLowerCase());
  return values.findIndex(
    att => {
      const ix = att.indexOf(keyword);
      return ix !== -1;
    }
  ) != -1;
}

function checkAttributeIn(bottle: Bottle, attribute: string, admissibleValues: string[ ]) {
  const attrValue = bottle[ attribute ] ? bottle[ attribute ].toString() : '';
  return admissibleValues.indexOf(attrValue) !== -1;
}

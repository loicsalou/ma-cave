import {BottleMetadata} from '../../model/bottle';
import * as _ from 'lodash';

/**
 * Created by loicsalou on 08.03.17.
 *
 * Classe contenant les différentes configurations "métier" de l'application.
 */
export class Configuration {

  private static SPECIAL_CHARS_REMOVED = new RegExp(/[\.|\d|\n|\r|,|!|?|@]/g);
  private static SEARCH_STRING_REMOVED_CHARS = new RegExp(/[\ |\-|\.|\d|\n|\r|,|!|?|@]/g);
  trads = require('../../assets/i18n/fr.json');

  public static regionsText2Code = {
    'Alsace et Lorraine': 'alsace',
    'Beaujolais': 'beaujolais',
    'Bordeaux': 'bordeaux',
    'Bourgogne': 'bourgogne',
    'Champagne': 'champagne',
    'Cognac': 'cognac',
    'Provence-Corse': 'corse',
    'Savoie, Dauphiné et Bugey': 'jura-savoie',
    'Jura': 'jura-savoie',
    'Languedoc-Roussillon': 'languedoc-roussillon',
    'Vallée de la Loire': 'loire',
    'Vallée du Rhône': 'rhone',
    'Sud-Ouest': 'sud-ouest'
  }

  public static colorsText2Code = {
    'rouge': 'red',
    'blanc': 'white',
    'blanc effervescent': 'bubbles',
    'cognac': 'cognac',
    'demi-sec': 'white-halfdry',
    'rosé effervescent': 'bubbles-rose',
    'rosé': 'rose',
    'vin jaune': 'yellow',
    'vin blanc muté': 'white-mutated',
    'blanc moëlleux': 'white-halfdry',
    'vin de paille': 'straw',
    'blanc liquoreux': 'liquorous'
  }

  /**
   * get the search string corresponding to the given text.
   * Basically this means the same string, as lowercase, from which all special chars have been removed.
   * @param text
   */
  public static getSearchStringFor(text: string): string {
    if (text) {
      return text.toLowerCase().replace(Configuration.SEARCH_STRING_REMOVED_CHARS, '');
    }
    return text;
  }

  public static getMetadata(bottle: Configuration | any): BottleMetadata {
    let keywords = [];
    keywords.push(Configuration.extractKeywords(bottle.comment));
    keywords.push(Configuration.extractKeywords(bottle.suggestion));
    keywords.push(Configuration.extractKeywords(bottle.area_label));
    keywords.push(Configuration.extractKeywords(bottle.label));
    keywords.push(Configuration.extractKeywords(bottle.subregion_label));
    keywords = _.uniq(_.flatten(keywords));

    return {
      area_label: bottle.area_label,
      area_label_search: Configuration.getSearchStringFor(bottle.area_label),
      nomCru: bottle.nomCru,
      subregion_label: bottle.subregion_label,
      keywords: keywords
    }
  }

  private static extractKeywords(text: string): string[] {
    if (text) {
      let ret = text.replace(Configuration.SPECIAL_CHARS_REMOVED, ' ');
      return ret
        .split(' ')
        .filter(keyword => keyword.length > 2)
        .map(keyword => keyword.toLowerCase());
    } else {
      return []
    }
  }

}

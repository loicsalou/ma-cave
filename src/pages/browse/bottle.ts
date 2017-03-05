/**
 * Created by loicsalou on 01.03.17.
 */
import * as _ from 'lodash';

export class Bottle {

  // regions: key is emitted when filtering, value matches existing values in the JSON containing the bottles. It comes from cavusvinifera

  public static regions = {
    alsace: 'Alsace et Lorraine',
    beaujolais: 'Beaujolais',
    bordeaux: 'Bordeaux',
    bourgogne: 'Bourgogne',
    champagne: 'Champagne',
    cognac: 'Cognac',
    corse: 'Provence-Corse',
    'jura-savoie': 'Savoie, Dauphiné et Bugey',
    'languedoc-roussillon': 'Languedoc-Roussillon',
    loire: 'Vallée de la Loire',
    provence: 'Provence-Corse',
    rhone: 'Vallée du Rhône',
    'sud-ouest': 'Sud-Ouest'
  }
  public static regions2 = {
    'Alsace et Lorraine': 'alsace',
    'Beaujolais': 'beaujolais',
    'Bordeaux': 'bordeaux',
    'Bourgogne': 'Bourgogne',
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

  // colors: key is emitted when filtering, value matches existing values in the JSON containing the bottles. It comes from cavusvinifera
  public static colors = {
    red: 'rouge',
    rose: 'rosé',
    'rose-sparkling': 'rosé effervescent',
    white: 'blanc',
    yellow: 'vin jaune',
    liquorous: 'blanc liquoreux',
    cognac: 'cognac',
    'white-sparkling': 'blanc effervescent'
  }

  public static colors2 = {
    'rouge': 'red',
    'blanc': 'white',
    'blanc effervescent': 'bubbles',
    'rosé effervescent': 'bubbles',
    'rosé': 'rose',
    'vin jaune': 'yellow',
    'vin blanc muté': 'yellow',
    'blanc moëlleux': 'liquorous',
    'vin de paille': 'liquorous',
    'blanc liquoreux': 'liquorous'
  }

  static showDistinctColors() {
    let json = require('../../assets/json/ma-cave.json');
    console.info(_.countBy(json, function(json) { return json.label; }));
  }

  static showDistinctRegions() {
    let json = require('../../assets/json/ma-cave.json');
    console.info(_.countBy(json, function(json) { return json.subregion_label; }));
  }

}

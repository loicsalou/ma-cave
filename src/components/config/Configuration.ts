/**
 * Created by loicsalou on 08.03.17.
 *
 * Classe contenant les différentes configurations "métier" de l'application.
 */
export class Configuration {

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
    'rosé effervescent': 'bubbles',
    'rosé': 'rose',
    'vin jaune': 'yellow',
    'vin blanc muté': 'yellow',
    'blanc moëlleux': 'liquorous',
    'vin de paille': 'liquorous',
    'blanc liquoreux': 'liquorous'
  }


}

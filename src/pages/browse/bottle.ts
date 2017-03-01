/**
 * Created by loicsalou on 01.03.17.
 */
export class Bottle {

  // regions: key is emitted when filtering, value matches existing values in the JSON containing the bottles. It comes from cavusvinifera
  public static regions = {
    alsace: 'Alsace et Lorraine',
    beaujolais: 'BEAUJOLAIS',
    bordeaux: 'Bordeaux',
    bourgogne: 'Bourgogne',
    champagne: 'Champagne',
    cognac: 'COGNAC',
    corse: 'Provence-Corse',
    'jura-savoie': 'Savoie, Dauphiné et Bugey',
    'languedoc-roussillon': 'Languedoc-Roussillon',
    loire: 'Vallée de la Loire',
    provence: 'Provence-Corse',
    rhone: 'Vallée du Rhône',
    'sud-ouest': 'Sud-Ouest'
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

}

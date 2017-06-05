/**
 * Created by loicsalou on 08.03.17.
 *
 * Classe contenant les différentes configurations "métier" de l'application.
 */
var Configuration = (function () {
    function Configuration() {
        this.trads = require('../../assets/i18n/fr.json');
    }
    return Configuration;
}());
export { Configuration };
Configuration.regionsText2Code = {
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
};
Configuration.colorsText2Code = {
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
};
//# sourceMappingURL=Configuration.js.map
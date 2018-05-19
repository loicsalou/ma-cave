export const appConfig = {
  services: {
    cavus: {
      baseUrl: 'http://www.cavus-vinifera.com/api/',
      login: 'login',
      logout: 'logout',
      getBottles: 'bottles'
    }
  },

  settings: {
    defaultTheme: 'default-theme',
    themes: [
      {
        name: 'cavus',
        class: 'cavus-theme'
      },
      {
        name: 'default',
        class: 'default-theme'
      }
    ]
  },

  statistics: {
    standardColors: [
      'blue', 'red', 'orange', 'aqua', 'aquamarine', 'blueviolet', 'green', 'cornsilk', 'fuchsia', 'grey', 'black'
    ],
    cssColorsByWineColor: {
      'autres': 'grey',
      'blanc': '#f7f7d4',
      'blanc effervescent': '#b3e87d',
      'blanc liquoreux': '#f99806',
      'blanc moëlleux': '#ffffcc',
      'cognac': '#c76605',
      'rosé': '#e619e6',
      'rosé effervescent': '#b946b9',
      'rouge': '#e61919',
      'vin blanc muté': '#9e662e',
      'vin de paille': '#ffbf00',
      'vin jaune': '#ffff00'
    }
  },

  colorsText2Code: {
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
  },

  regionsText2Code: {
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
  },

  bottles: {
    colorsData: {
      'cognac': 'cognac',
      'half-dry': 'blanc moëlleux',
      'liquorous': 'blanc liquoreux',
      'red': 'rouge',
      'rose': 'rosé',
      'rose-sparkling': 'rosé effervescent',
      'straw': 'vin de paille',
      'undefined': 'vin indéfini',
      'white-mutated': 'vin blanc muté',
      'red-mutated': 'vin rouge muté',
      'white': 'blanc',
      'white-sparkling': 'blanc effervescent',
      'yellow': 'vin jaune'
    },
    regionsData: {
      'autre': 'Autres régions',
      'alsace': 'Alsace et Lorraine',
      'beaujolais': 'Beaujolais',
      'bordeaux': 'Bordeaux',
      'bourgogne': 'Bourgogne',
      'champagne': 'Champagne',
      'cognac': 'Cognac',
      'corse': 'Provence-Corse',
      'jura-savoie': 'Savoie, Dauphiné et Bugey',
      'languedoc-roussillon': 'Languedoc-Roussillon',
      'loire': 'Vallée de la Loire',
      'provence': 'Provence-Corse',
      'rhone': 'Vallée du Rhône',
      'sud-ouest': 'Sud-Ouest'
    },
    aocData: {
      'Alsace': [
        {
          'Subdivisions': '',
          'Appellations': 'alsace grand cru',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'alsace ou vin d\'Alsace',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'crémant d\'Alsace',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Beaujolais': [
        {
          'Subdivisions': '',
          'Appellations': 'beaujolais',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'beaujolais-villages',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'brouilly',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'chénas',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'chiroubles',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'côte-de-brouilly',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'fleurie',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'juliénas',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'morgon',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'moulin-à-vent',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'régnié',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'saint-amour',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Bordeaux': [
        {
          'Subdivisions': 'Blayais et Bourgeais',
          'Appellations': 'blaye',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Blayais et Bourgeais',
          'Appellations': 'côtes-de-blaye',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Blayais et Bourgeais',
          'Appellations': 'côtes-de-bourg ou bourg ou bourgeais',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Entre-deux-Mers',
          'Appellations': 'cadillac',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux'
        },
        {
          'Subdivisions': 'Entre-deux-Mers',
          'Appellations': 'côtes-de-bordeaux-saint-macaire',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux, moelleux'
        },
        {
          'Subdivisions': 'Entre-deux-Mers',
          'Appellations': 'entre-deux-mers',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Entre-deux-Mers',
          'Appellations': 'loupiac',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux'
        },
        {
          'Subdivisions': 'Entre-deux-Mers',
          'Appellations': 'premières-côtes-de-bordeaux',
          'Type de vins produit': '',
          'Teneur en sucre': 'Moelleux'
        },
        {
          'Subdivisions': 'Entre-deux-Mers',
          'Appellations': 'sainte-croix-du-mont',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux'
        },
        {
          'Subdivisions': 'Entre-deux-Mers',
          'Appellations': 'sainte-foy-bordeaux',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux, moelleux'
        },
        {
          'Subdivisions': 'Entre-deux-Mers, Libournais, Blayais et Bourgeais',
          'Appellations': 'côtes-de-bordeaux',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux, moelleux'
        },
        {
          'Subdivisions': 'Graves',
          'Appellations': 'cérons',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux'
        },
        {
          'Subdivisions': 'Graves',
          'Appellations': 'graves',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Graves',
          'Appellations': 'graves-supérieures',
          'Type de vins produit': '',
          'Teneur en sucre': 'Moelleux'
        },
        {
          'Subdivisions': 'Graves',
          'Appellations': 'pessac-léognan',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Libournais',
          'Appellations': 'canon-fronsac',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Libournais',
          'Appellations': 'fronsac',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Libournais',
          'Appellations': 'lalande-de-pomerol',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Libournais',
          'Appellations': 'lussac-saint-émilion',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Libournais',
          'Appellations': 'montagne-saint-émilion',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Libournais',
          'Appellations': 'pomerol',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Libournais',
          'Appellations': 'puisseguin-saint-émilion',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Libournais',
          'Appellations': 'saint-émilion',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Libournais',
          'Appellations': 'saint-émilion grand cru',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Libournais',
          'Appellations': 'saint-georges-saint-émilion',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Médoc',
          'Appellations': 'haut-médoc',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Médoc',
          'Appellations': 'listrac-médoc',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Médoc',
          'Appellations': 'margaux',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Médoc',
          'Appellations': 'médoc',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Médoc',
          'Appellations': 'moulis ou moulis-en-médoc',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Médoc',
          'Appellations': 'pauillac',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Médoc',
          'Appellations': 'saint-estèphe',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Médoc',
          'Appellations': 'saint-julien',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Sauternais',
          'Appellations': 'barsac',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux'
        },
        {
          'Subdivisions': 'Sauternais',
          'Appellations': 'sauternes',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux'
        },
        {
          'Subdivisions': '',
          'Appellations': 'bordeaux',
          'Type de vins produit': 'Clairet',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'bordeaux supérieur',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'crémant de Bordeaux',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'graves-de-vayres',
          'Type de vins produit': '',
          'Teneur en sucre': 'Moelleux'
        }
      ],
      'Bourgogne': [
        {
          'Subdivisions': 'Basse-Bourgogne',
          'Appellations': 'chablis',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Basse-Bourgogne',
          'Appellations': 'chablis grand cru',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Basse-Bourgogne',
          'Appellations': 'irancy',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Basse-Bourgogne',
          'Appellations': 'petit-chablis',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Basse-Bourgogne',
          'Appellations': 'saint-bris',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte chalonnaise',
          'Appellations': 'bouzeron',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte chalonnaise',
          'Appellations': 'givry',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte chalonnaise',
          'Appellations': 'mercurey',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte chalonnaise',
          'Appellations': 'montagny',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte chalonnaise',
          'Appellations': 'rully',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Côte de Beaune',
          'Appellations': 'aloxe-corton',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'auxey-duresses',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'bâtard-montrachet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'beaune',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'bienvenues-bâtard-montrachet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'blagny',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'charlemagne',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'chassagne-montrachet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'chevalier-montrachet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'chorey-lès-beaune',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'corton',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'corton-charlemagne',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'côte-de-beaune',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'côte-de-beaune-villages',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'criots-bâtard-montrachet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'ladoix',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'maranges',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'meursault',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'monthélie',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'montrachet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'pernand-vergelesses',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'pommard',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'puligny-montrachet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'saint-aubin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'saint-romain',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'santenay',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'savigny-lès-beaune',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Beaune',
          'Appellations': 'volnay',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'bonnes-mares',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'chambertin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'chambertin-clos-de-bèze',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'chambolle-musigny',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'chapelle-chambertin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'charmes-chambertin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'clos-de-la-roche',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'clos-de-tart',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'clos-de-vougeot ou clos-vougeot',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'clos-des-lambrays',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'clos-saint-denis',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'côte-de-nuits-villages',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'échezeaux',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'fixin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'gevrey-chambertin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'grands-échezeaux',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'griotte-chambertin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'la-grande-rue',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'la-romanée',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'la-tâche',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'latricières-chambertin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'marsannay',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'mazis-chambertin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'mazoyères-chambertin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'morey-saint-denis',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'musigny',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'nuits-saint-georges',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'richebourg',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'romanée-conti',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'romanée-saint-vivant',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'ruchottes-chambertin',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'vosne-romanée',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côte de Nuits',
          'Appellations': 'vougeot',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Mâconnais',
          'Appellations': 'mâcon',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Mâconnais',
          'Appellations': 'pouilly-fuissé',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Mâconnais',
          'Appellations': 'pouilly-loché',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Mâconnais',
          'Appellations': 'pouilly-vinzelles',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Mâconnais',
          'Appellations': 'saint-véran',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Mâconnais',
          'Appellations': 'viré-clessé',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'bourgogne',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'bourgogne aligoté',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'bourgogne mousseux',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'bourgogne passe-tout-grains',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'coteaux-bourguignons',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'coteaux-du-lyonnais',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'crémant de Bourgogne',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Bugey': [
        {
          'Subdivisions': '',
          'Appellations': 'bugey',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'roussette du Bugey',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Champagne': [
        {
          'Subdivisions': 'Côte des Bars',
          'Appellations': 'rosé des Riceys',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Côte des Blancs, Côte des Bar, Montagne de Reims,Vallée de la Marne',
          'Appellations': 'coteaux-champenois',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'champagne',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Corse': [
        {
          'Subdivisions': '',
          'Appellations': 'ajaccio',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'corse ou vin de Corse',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'muscat du Cap-Corse',
          'Type de vins produit': '',
          'Teneur en sucre': 'Doux naturel'
        },
        {
          'Subdivisions': '',
          'Appellations': 'patrimonio',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Jura': [
        {
          'Subdivisions': '',
          'Appellations': 'arbois',
          'Type de vins produit': 'Jaune, de paille',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'château-chalon',
          'Type de vins produit': 'Jaune',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'côtes-du-jura',
          'Type de vins produit': 'Jaune, de paille',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'crémant du Jura',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'l\'étoile',
          'Type de vins produit': 'Jaune, de paille',
          'Teneur en sucre': ''
        }
      ],
      'Languedoc': [
        {
          'Subdivisions': 'coteaux de l\'Aude',
          'Appellations': 'cabardès',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'coteaux de l\'Aude',
          'Appellations': 'corbières',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'coteaux de l\'Aude',
          'Appellations': 'limoux',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'coteaux de l\'Aude',
          'Appellations': 'minervois',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'coteaux de l\'Aude (Corbières)',
          'Appellations': 'corbières-boutenac',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'coteaux de l\'Aude (Corbières)',
          'Appellations': 'fitou',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'coteaux de l\'Aude (Limouxin)',
          'Appellations': 'crémant de Limoux',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'coteaux de l\'Aude (Razès)',
          'Appellations': 'malepère',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'coteaux du Languedoc',
          'Appellations': 'clairette du Languedoc',
          'Type de vins produit': '',
          'Teneur en sucre': 'Doux naturel'
        },
        {
          'Subdivisions': 'coteaux du Languedoc',
          'Appellations': 'faugères',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Minervois',
          'Appellations': 'muscat de Saint-Jean-de-Minervois',
          'Type de vins produit': '',
          'Teneur en sucre': 'Doux naturel'
        },
        {
          'Subdivisions': 'Petit Causse',
          'Appellations': 'minervois-la-livinière',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'plaine du Languedoc',
          'Appellations': 'muscat de Frontignan ou vin de Frontignan',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux et doux naturel'
        },
        {
          'Subdivisions': 'plaine du Languedoc',
          'Appellations': 'muscat de Mireval',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux et doux naturel'
        },
        {
          'Subdivisions': '',
          'Appellations': 'languedoc',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'muscat de Lunel',
          'Type de vins produit': '',
          'Teneur en sucre': 'Doux naturel'
        },
        {
          'Subdivisions': '',
          'Appellations': 'saint-chinian',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Languedoc-Roussillon': [
        {
          'Subdivisions': 'Roussillon',
          'Appellations': 'banyuls',
          'Type de vins produit': '',
          'Teneur en sucre': 'Doux naturel'
        },
        {
          'Subdivisions': 'Roussillon',
          'Appellations': 'banyuls grand cru',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Lorraine': [
        {
          'Subdivisions': 'Côtes de Meuse',
          'Appellations': 'côtes-de-toul',
          'Type de vins produit': 'Gris',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Pays messin, val de Seille et val de Sierck',
          'Appellations': 'moselle[1]',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Provence': [
        {
          'Subdivisions': 'moyenne vallée de la Durance',
          'Appellations': 'pierrevert',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'bandol',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'bellet ou vin de Bellet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'cassis',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'coteaux-d\'aix-en-provence',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'coteaux-varois-en-provence',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux, moelleux'
        },
        {
          'Subdivisions': '',
          'Appellations': 'côtes-de-provence',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'les-baux-de-provence',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'palette',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Roussillon': [
        {
          'Subdivisions': 'Côte Vermeille',
          'Appellations': 'collioure',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Fenouillèdes',
          'Appellations': 'maury',
          'Type de vins produit': '',
          'Teneur en sucre': 'Doux naturel'
        },
        {
          'Subdivisions': 'Roussillon (Fenouillèdes, plaine du Roussillon, Bas-Conflent, Aspres et Ribéral)',
          'Appellations': 'muscat de Rivesaltes',
          'Type de vins produit': '',
          'Teneur en sucre': 'Doux naturel'
        },
        {
          'Subdivisions': 'Roussillon (Fenouillèdes, plaine du Roussillon, Bas-Conflent, Aspres et Ribéral)',
          'Appellations': 'rivesaltes',
          'Type de vins produit': '',
          'Teneur en sucre': 'Doux naturel'
        },
        {
          'Subdivisions': '',
          'Appellations': 'côtes-du-roussillon',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'Côtes-du-roussillon villages',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Savoie': [
        {
          'Subdivisions': '',
          'Appellations': 'roussette de Savoie',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'vin de Savoie ou savoie',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Savoie et Bugey': [
        {
          'Subdivisions': '',
          'Appellations': 'seyssel',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'Sud-Ouest': [
        {
          'Subdivisions': 'Bergeracois',
          'Appellations': 'bergerac',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Bergeracois',
          'Appellations': 'côtes-de-bergerac',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Bergeracois',
          'Appellations': 'côtes-de-montravel',
          'Type de vins produit': '',
          'Teneur en sucre': 'Moelleux'
        },
        {
          'Subdivisions': 'Bergeracois',
          'Appellations': 'haut-montravel',
          'Type de vins produit': '',
          'Teneur en sucre': 'Moelleux'
        },
        {
          'Subdivisions': 'Bergeracois',
          'Appellations': 'monbazillac',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux'
        },
        {
          'Subdivisions': 'Bergeracois',
          'Appellations': 'montravel',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Bergeracois',
          'Appellations': 'pécharmant',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Bergeracois',
          'Appellations': 'rosette',
          'Type de vins produit': '',
          'Teneur en sucre': 'Moelleux'
        },
        {
          'Subdivisions': 'Bergeracois',
          'Appellations': 'saussignac',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux'
        },
        {
          'Subdivisions': 'Massif central méridional',
          'Appellations': 'marcillac',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'moyenne Garonne',
          'Appellations': 'buzet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'moyenne Garonne',
          'Appellations': 'côtes-de-duras',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'moyenne Garonne',
          'Appellations': 'côtes-du-marmandais',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'moyenne Garonne',
          'Appellations': 'fronton',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Pays basque',
          'Appellations': 'irouléguy',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'piémont du Massif central',
          'Appellations': 'gaillac',
          'Type de vins produit': '',
          'Teneur en sucre': 'Moelleux'
        },
        {
          'Subdivisions': 'piémont du Massif central',
          'Appellations': 'gaillac-premières-côtes',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'piémont du Massif central (Quercy)',
          'Appellations': 'cahors',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Piémont pyrénéen',
          'Appellations': 'béarn',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Piémont pyrénéen',
          'Appellations': 'jurançon',
          'Type de vins produit': '',
          'Teneur en sucre': 'Moelleux'
        },
        {
          'Subdivisions': 'Piémont pyrénéen (Armagnac)',
          'Appellations': 'madiran',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Piémont pyrénéen (Armagnac)',
          'Appellations': 'pacherenc-du-vic-bilh',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux, moelleux'
        }
      ],
      'vallée de la Loire': [
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'anjou',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'anjou villages',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'anjou villages brissac',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'anjou-coteaux-de-la-loire',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'bonnezeaux',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux'
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'coteaux-de-l\'aubance',
          'Type de vins produit': '',
          'Teneur en sucre': 'Moelleux'
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'coteaux-du-layon',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux, moelleux'
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'quarts-de-chaume',
          'Type de vins produit': '',
          'Teneur en sucre': 'Liquoreux'
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'rosé d\'Anjou',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'saumur',
          'Type de vins produit': 'Rouge et rosé mousseux',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'saumur-champigny',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Anjou',
          'Appellations': 'savennières',
          'Type de vins produit': '',
          'Teneur en sucre': 'Sec, moelleux'
        },
        {
          'Subdivisions': 'Anjou (Saumurois)',
          'Appellations': 'coteaux-de-saumur',
          'Type de vins produit': '',
          'Teneur en sucre': 'Moelleux'
        },
        {
          'Subdivisions': 'Anjou, Touraine',
          'Appellations': 'crémant de Loire',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Anjou, Touraine',
          'Appellations': 'rosé de Loire',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Berry',
          'Appellations': 'menetou-salon',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Berry',
          'Appellations': 'quincy',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Berry',
          'Appellations': 'sancerre',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Bourbonnais',
          'Appellations': 'saint-pourçain',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Centre',
          'Appellations': 'coteaux-du-giennois',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Côtes d\'auvergne',
          'Appellations': 'Boudes',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côtes d\'Auvergne',
          'Appellations': 'Chanturgue',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côtes d\'Auvergne',
          'Appellations': 'Châteaugay',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côtes d\'Auvergne',
          'Appellations': 'Corent',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'côtes d\'Auvergne',
          'Appellations': 'madargue',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Forez',
          'Appellations': 'côtes-du-forez',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Nivernais',
          'Appellations': 'pouilly-fumé ou blanc-fumé de Pouilly',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Nivernais',
          'Appellations': 'pouilly-sur-loire',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Orléanais',
          'Appellations': 'orléans',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Orléanais',
          'Appellations': 'orléans-cléry',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Poitou',
          'Appellations': 'haut-poitou',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Roannais',
          'Appellations': 'côte-roannaise',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Touraine',
          'Appellations': 'bourgueil',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Touraine',
          'Appellations': 'cheverny',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Touraine',
          'Appellations': 'chinon',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Touraine',
          'Appellations': 'cour-cheverny',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Touraine',
          'Appellations': 'jasnières',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Touraine',
          'Appellations': 'montlouis-sur-loire',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Touraine',
          'Appellations': 'saint-nicolas-de-bourgueil',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Touraine',
          'Appellations': 'touraine',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Touraine',
          'Appellations': 'touraine-noble-joué',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Touraine',
          'Appellations': 'vouvray',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Vignoble nantais',
          'Appellations': 'muscadet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Vignoble nantais',
          'Appellations': 'muscadet-coteaux-de-la-loire',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Vignoble nantais',
          'Appellations': 'muscadet-côtes-de-grandlieu',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Vignoble nantais',
          'Appellations': 'muscadet-sèvre-et-maine',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'cabernet d\'Anjou',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'cabernet de Saumur',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'châteaumeillant',
          'Type de vins produit': 'Gris',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'coteaux-du-loir',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'coteaux-du-vendômois',
          'Type de vins produit': 'Gris',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'fiefs-vendéens',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'reuilly',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'valençay',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ],
      'vallée du Rhône': [
        {
          'Subdivisions': 'Diois (vallée de la Drôme)',
          'Appellations': 'châtillon-en-diois',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Diois (vallée de la Drôme)',
          'Appellations': 'clairette de Die',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Diois (vallée de la Drôme)',
          'Appellations': 'coteaux-de-die',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Diois (vallée de la Drôme)',
          'Appellations': 'crémant de Die',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Gard',
          'Appellations': 'clairette de Bellegarde',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Gard',
          'Appellations': 'costières-de-nîmes',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Gard',
          'Appellations': 'tavel',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Luberon',
          'Appellations': 'luberon',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône méridional',
          'Appellations': 'beaumes-de-venise',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône méridional',
          'Appellations': 'châteauneuf-du-pape',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône méridional',
          'Appellations': 'Côtes-du-rhône villages',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône méridional',
          'Appellations': 'gigondas',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône méridional',
          'Appellations': 'lirac',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône méridional',
          'Appellations': 'muscat de Beaumes-de-Venise',
          'Type de vins produit': '',
          'Teneur en sucre': 'Doux naturel'
        },
        {
          'Subdivisions': 'Rhône méridional',
          'Appellations': 'rasteau',
          'Type de vins produit': '',
          'Teneur en sucre': 'Doux naturel'
        },
        {
          'Subdivisions': 'Rhône méridional',
          'Appellations': 'vacqueyras',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône méridional',
          'Appellations': 'vinsobres',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône méridonal',
          'Appellations': 'grignan-les-adhémar',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône septentrional',
          'Appellations': 'château-grillet',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône septentrional',
          'Appellations': 'condrieu',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône septentrional',
          'Appellations': 'cornas',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône septentrional',
          'Appellations': 'côte-rôtie',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône septentrional',
          'Appellations': 'crozes-hermitage ou crozes-ermitage',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône septentrional',
          'Appellations': 'hermitage ou ermitage',
          'Type de vins produit': 'De paille',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône septentrional',
          'Appellations': 'saint-joseph',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': 'Rhône septentrional, Rhône méridional',
          'Appellations': 'côtes-du-rhône',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'côtes-du-vivarais',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'duché-d\'Uzès',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'saint-péray',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        },
        {
          'Subdivisions': '',
          'Appellations': 'ventoux',
          'Type de vins produit': '',
          'Teneur en sucre': ''
        }
      ]
    }
  }
}

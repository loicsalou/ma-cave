/**
 * Created by loicsalou on 08.07.2017.
 */
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Statistics} from './statistics';
import {Dimension, Locker, LockerType} from './locker';
import {FridgeLocker} from './fridge-locker';
import {SimpleLocker} from './simple-locker';

/**
 * Instanciation des casiers.
 * Cette factory en profite pour ajouter des attributs à la volée:
 * - l'image par défaut au cas où l'URL du casier lui-même ne pointerait sur rien
 */
@Injectable()
export class LockerFactory {

  constructor(private i18n: TranslateService) {
  }

  public create(json): Locker {
    let locker: Locker;
    if (json[ 'type' ] === LockerType.fridge) {
      let dim: Dimension[] = json.dimensions.map(dim => <Dimension> {x: +dim.x, y: +dim.y});
      locker = new FridgeLocker(json[ 'id' ], json[ 'name' ], json[ 'type' ], dim, json[ 'comment' ], json[ 'supportedFormats' ],
                                json[ 'defaultImage' ], json[ 'imageUrl' ]);
    } else {
      let dim: Dimension = <Dimension> {x: +json.dimension.x, y: +json.dimension.y};
      locker = new SimpleLocker(json[ 'id' ], json[ 'name' ], json[ 'type' ], dim, false, json[ 'comment' ],
                                json[ 'supportedFormats' ], json[ 'defaultImage' ], json[ 'imageUrl' ]);
    }
    return locker;
  }

}

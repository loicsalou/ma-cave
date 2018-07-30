/**
 * Created by loicsalou on 08.07.2017.
 */
import {Injectable} from '@angular/core';
import {Locker} from './locker';
import {FridgeLocker} from './fridge-locker';
import {SimpleLocker} from './simple-locker';
import {LockerType} from './locker-type';
import {LockerDimension} from './locker-dimension';

/**
 * Instanciation des casiers.
 * Cette factory en profite pour ajouter des attributs à la volée:
 * - l'image par défaut au cas où l'URL du casier lui-même ne pointerait sur rien
 */
@Injectable()
export class LockerFactory {

  constructor() {
  }

  public create(json): Locker {
    let locker: Locker;
    if (json[ 'type' ] === LockerType.fridge) {
      let dim: LockerDimension[] = json.dimensions.map(dim => <LockerDimension> {x: +dim.x, y: +dim.y});
      locker = new FridgeLocker(json[ 'id' ], json[ 'name' ], json[ 'type' ], dim, json[ 'comment' ], json[ 'supportedFormats' ],
                                json[ 'defaultImage' ], json[ 'imageUrl' ]);
    } else {
      let dim: LockerDimension = <LockerDimension> {x: +json.dimension.x, y: +json.dimension.y};
      locker = new SimpleLocker(json[ 'id' ], json[ 'name' ], json[ 'type' ], dim, false, json[ 'comment' ],
                                json[ 'supportedFormats' ], json[ 'defaultImage' ], json[ 'imageUrl' ]);
    }
    return locker;
  }

}

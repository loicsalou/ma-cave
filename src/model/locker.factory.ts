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

  constructor(private i18n: TranslateService, private _stats: Statistics) {
  }

  public create(json): Locker {
    let locker: Locker;
    if (json[ 'type' ] === LockerType.fridge) {
      let dim: Dimension[]=json.dimensions;
      locker = new FridgeLocker(json['id'], json[ 'name' ], json[ 'type' ], dim, json[ 'comment' ], json[ 'supportedFormats' ],
                                json[ 'defaultImage' ], json[ 'imageUrl' ]);
    } else {
      let dim: Dimension=json.dimension;
      locker = new SimpleLocker(json['id'], json[ 'name' ], LockerType.simple, dim, json[ 'comment' ],
                                json[ 'supportedFormats' ], json[ 'defaultImage' ], json[ 'imageUrl' ]);
    }
    return locker;
  }

  private setDefaultImage(locker: Locker): LockerFactory {
    locker.defaultImage = '/assets/icon/locker.png';
    return this;
  }

}

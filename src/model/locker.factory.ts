/**
 * Created by loicsalou on 08.07.2017.
 */
import {Injectable} from '@angular/core';
import {Locker} from './locker';
import {TranslateService} from '@ngx-translate/core';
import {Statistics} from './statistics';

/**
 * Instanciation des casiers.
 * Cette factory en profite pour ajouter des attributs à la volée:
 * - l'image par défaut au cas où l'URL du casier lui-même ne pointerait sur rien
 */
@Injectable()
export class LockerFactory {

  constructor(private i18n: TranslateService, private _stats: Statistics) {
  }

  public create(lck: Locker): Locker {
    return lck;
  }

  private setDefaultImage(locker: Locker): LockerFactory {
    locker.defaultImage = '/assets/icon/locker.png';
    return this;
  }

}

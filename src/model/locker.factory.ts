/**
 * Created by loicsalou on 08.07.2017.
 */
import {Injectable} from '@angular/core';
import {SimpleLocker} from './simple-locker';
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

  public create(lck: SimpleLocker): SimpleLocker {
    return lck;
  }

  private setDefaultImage(locker: SimpleLocker): LockerFactory {
    locker.defaultImage = '/assets/icon/locker.png';
    return this;
  }

}

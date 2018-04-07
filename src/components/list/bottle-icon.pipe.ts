import {Inject, Pipe, PipeTransform} from '@angular/core';
import {BottleFactory} from '../../model/bottle.factory';
import {Bottle} from '../../model/bottle';

/*
 * get the icon matching the wine
 */
@Pipe({
        name: 'bottleIcon',
        pure: false
      })
export class BottleIconPipe implements PipeTransform {

  constructor(private bottleFactory: BottleFactory) {
  }

  transform(bottle: Bottle, ...args: any[]): any {
    return this.bottleFactory.getImage(bottle)

  }
}

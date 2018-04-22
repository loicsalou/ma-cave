import {Pipe, PipeTransform} from '@angular/core';
import {BottleFactory} from '../../model/bottle.factory';
import {Bottle} from '../../model/bottle';

/*
 * get the icon matching the wine
 */
@Pipe({
        name: 'bottleClass',
        pure: false
      })
export class BottleClassPipe implements PipeTransform {

  constructor(private bottleFactory: BottleFactory) {
  }

  transform(bottle: Bottle, ...args: any[]): any {
    return this.bottleFactory.getWineColorClass(bottle);

  }
}

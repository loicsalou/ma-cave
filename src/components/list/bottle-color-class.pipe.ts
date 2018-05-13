import {Inject, Pipe, PipeTransform} from '@angular/core';
import {Bottle} from '../../model/bottle';

/*
 * get the icon matching the wine
 */
@Pipe({
        name: 'bottleClass',
        pure: false
      })
export class BottleClassPipe implements PipeTransform {

  constructor(@Inject('GLOBAL_CONFIG') protected config) {
  }

  transform(bottle: Bottle, ...args: any[]): any {
    return `wine-${this.config.colorsText2Code[bottle.label]}`;

  }
}

import {Inject, Pipe, PipeTransform} from '@angular/core';
import {Bottle} from '../../model/bottle';

/*
 * get the icon matching the wine
 */
@Pipe({
        name: 'bottleIcon',
        pure: false
      })
export class BottleIconPipe implements PipeTransform {

  constructor(@Inject('GLOBAL_CONFIG') protected config) {
  }

  transform(bottle: Bottle, ...args: any[]): any {
    const color = bottle.label === undefined ? 'undefined' : this.config.colorsText2Code[ bottle.label.toLowerCase() ];
    return 'assets/img/bottle-color/' + color + '.png';
  }
}

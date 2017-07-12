import {Pipe, PipeTransform} from '@angular/core';
import {Configuration} from '../../config/Configuration';
/*
 * get the icon matching the wine
 */
@Pipe({
        name: 'bottleIcon'
      })
export class BottleIconPipe implements PipeTransform {

  transform(value: string): string {
    let color = this.getColor(value);
    return 'assets/img/bottle-color/' + color + '.png';
  }

  getColor(label: string): string {
    return Configuration.colorsText2Code[ label.toLowerCase() ];
  }
}

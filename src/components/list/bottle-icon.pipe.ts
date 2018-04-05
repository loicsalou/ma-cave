import {Pipe, PipeTransform} from '@angular/core';

/*
 * get the icon matching the wine
 * TODO supprimer colorsText2Code c'est deg... comment injecter app.conf ???
 */
@Pipe({
        name: 'bottleIcon',
        pure: false
      })
export class BottleIconPipe implements PipeTransform {
  private static colorsText2Code = {
    'rouge': 'red',
    'blanc': 'white',
    'blanc effervescent': 'bubbles',
    'cognac': 'cognac',
    'demi-sec': 'white-halfdry',
    'rosé effervescent': 'bubbles-rose',
    'rosé': 'rose',
    'vin jaune': 'yellow',
    'vin blanc muté': 'white-mutated',
    'blanc moëlleux': 'white-halfdry',
    'vin de paille': 'straw',
    'blanc liquoreux': 'liquorous'
  };

  transform(value: any, ...args: any[]): any {
    let color = this.getColor(value);
    return 'assets/img/bottle-color/' + color + '.png';
  }

  getColor(label: string): string {
    return label === undefined ? 'undefined' : BottleIconPipe.colorsText2Code[ label.toLowerCase() ];
  }
}

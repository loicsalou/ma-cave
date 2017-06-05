import {Component} from '@angular/core';
import {Statistics} from '../bottle/statistics';

/**
 * Generated class for the StatisticsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'statistics',
             templateUrl: 'statistics.html'
           })
export class StatisticsComponent {


  constructor(private stats: Statistics) {
    console.info(stats);
  }

}

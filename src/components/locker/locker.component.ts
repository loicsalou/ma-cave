import {Component, Input} from '@angular/core';
import {Locker} from '../../model/locker';

/**
 * Generated class for the LockerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'locker',
             templateUrl: './locker.component.html',
             styleUrls: [ '/locker.component.scss' ]
           })
export class LockerComponent {

  @Input()
  locker: Locker;

  constructor() {
  }

}

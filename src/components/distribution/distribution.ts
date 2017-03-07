import {Component, Input} from '@angular/core';

/*
  Generated class for the Distribution component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'distribution',
  templateUrl: 'distribution.html'
})
export class DistributionComponent {

  @Input()
  distribution;

  constructor() {
  }

}

import {Component, Input, EventEmitter} from '@angular/core';

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
  badgeClicked: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  valueClicked($event) {
    console.info("filter clicked: "+$event.currentTarget.textContent);
    let value=$event.currentTarget.textContent.split(':')[0];
    this.badgeClicked.emit(value);
  }

}



// WEBPACK FOOTER //
// ./src/components/distribution/distribution.ts

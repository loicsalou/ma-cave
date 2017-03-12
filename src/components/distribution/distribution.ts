import {Component, Input, EventEmitter, OnChanges} from "@angular/core";

/*
 Generated class for the Distribution component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'distribution',
  templateUrl: 'distribution.html',
  styleUrls: ['/src/components/distribution/distribution.scss']
})
export class DistributionComponent implements OnChanges {

  @Input()
  distribution;
  badgeClicked: EventEmitter<any> = new EventEmitter();
  isOpened = false;

  constructor() {
  }

  ngOnChanges() {
    this.open();
  }

  open() {
    this.isOpened=true;
  }

  close() {
    this.isOpened=false;
  }

  valueClicked($event, axis: string) {
    console.info('filter clicked: ' + $event.currentTarget.textContent + ' axis is ' + axis);
    let value = {value: $event.currentTarget.textContent.split(':')[0], axis: axis};
    this.badgeClicked.emit(value);
    this.isOpened=false;
  }

}


// WEBPACK FOOTER //
// ./src/components/distribution/distribution.ts

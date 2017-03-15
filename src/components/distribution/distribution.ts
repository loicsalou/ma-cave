import {Component, Input, EventEmitter, OnChanges, Output} from "@angular/core";

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
  @Input()
  opened = false;
  @Output()
  badgeClicked: EventEmitter<any> = new EventEmitter();


  constructor() {
  }

  ngOnChanges() {
    console.info("opened:"+this.opened);
    //this.open();
  }

  valueClicked($event, axis: string) {
    axis = axis ? axis.trim() : '';
    let filterValue = $event.currentTarget.textContent.split(':')[0];
    filterValue = filterValue ? filterValue.trim() : '';
    let value = {value: filterValue, axis: axis};
    this.badgeClicked.emit(value);
  }

}


// WEBPACK FOOTER //
// ./src/components/distribution/distribution.ts

import {Component, EventEmitter, Output} from '@angular/core';

/*
  Generated class for the France component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'france-component',
  templateUrl: 'france.component.html',
  styleUrls: [
    '/france.component.scss'
  ]
})
export class FranceComponent {
  @Output()
  areaChosen: EventEmitter<string>=new EventEmitter();

  constructor() {
  }

  showArea(event: string) {
    this.areaChosen.emit(event);
  }

  showAll(event: string) {
    this.areaChosen.emit('*');
  }

}

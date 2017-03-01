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
  text: string;
  @Output()
  areaChosen: EventEmitter<string>=new EventEmitter();

  constructor() {
  }

  onclick(event: string) {
    console.info('zone '+event+' cliquée');
    this.areaChosen.emit(event);
  }

}

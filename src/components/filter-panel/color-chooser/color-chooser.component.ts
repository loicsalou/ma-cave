import {Component, Output, EventEmitter} from "@angular/core";

/*
 Generated class for the ColorChooser component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'color-chooser-component',
  templateUrl: 'color-chooser.component.html',
  styleUrls: [
    '/src/components/filter-panel/color-chooser/color-chooser.component.scss'
  ]
})
export class ColorChooserComponent {
  @Output()
  colorChosen: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  chooseColor(event: string) {
    this.colorChosen.emit(event);
  }

  chooseAll(event?: string) {
    this.colorChosen.emit('*');
  }
}

import {Component, Input} from "@angular/core";
import {Bottle} from "../../../pages/browse/bottle";

/*
 Generated class for the BottleItemComponent component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'bottle-item',
  templateUrl: 'bottle-item.component.html'
})
export class BottleItemComponent {
  @Input()
  bottle: Bottle;

  constructor() {
  }

}

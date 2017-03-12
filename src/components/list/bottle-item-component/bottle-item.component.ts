import {Component, Input} from "@angular/core";
import {Bottle} from "../../bottle/bottle";
import {Bottles} from "../../config/Bottles";
import {Configuration} from "../../config/Configuration";

/*
 Generated class for the BottleItemComponent component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'bottle-item',
  templateUrl: 'bottle-item.component.html',
  styleUrls: ['/scr/components/list/bottle-item-component/bottle-item.component.scss']
})
export class BottleItemComponent {
  @Input()
  bottle: Bottle;

  constructor() {
  }

  setClasses(): string {
    return Configuration.colorsText2Code[this.bottle['label']];
  }

  botttle
}

import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Bottle} from "../../bottle/bottle";
import {Configuration} from "../../config/Configuration";

/*
 Generated class for the BottleItemComponent component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
             selector: 'bottle-item',
             templateUrl: 'bottle-item.component.html',
             styleUrls: [ '/scr/components/list/bottle-item-component/bottle-item.component.scss' ]
           })
export class BottleItemComponent {
  @Input()
  bottle: Bottle;

  @Output()
  showDetail: EventEmitter<Bottle> = new EventEmitter();

  constructor() {
  }

  setClasses(): string {
    return Configuration.colorsText2Code[ this.bottle[ 'label' ] ];
  }

  triggerDetail(event: any) {
    this.showDetail.emit(this.bottle);
  }
}

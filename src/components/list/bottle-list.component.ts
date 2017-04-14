import {Component, Input, Output, EventEmitter} from "@angular/core";
import {BottleService} from "../../components/bottle/bottle.service";
import {Bottle} from "../bottle/bottle";
import {ListBottleEvent} from "./bottle-list-event";

@Component({
             selector: 'bottle-list',
             templateUrl: 'bottle-list.component.html',
             styleUrls: [ '/bottle-list.component.scss' ]
           })
export class BottleListComponent {

  isFilterPanelShown = false;
  @Input()
  bottles;

  @Output()
  showDetail: EventEmitter<ListBottleEvent> = new EventEmitter();

  constructor(private bottlesService: BottleService) {
  }

  filter() {
    this.isFilterPanelShown = true;
  }

  clicked(event: any) {
  }

  triggerDetail(bottle: Bottle, index: number) {
    this.showDetail.emit(<ListBottleEvent>{bottles: this.bottles, bottle: bottle, index: index});
  }

  color(bottle: Bottle) {
    return 'red';
  }
}

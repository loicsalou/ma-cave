import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Platform, NavController, ActionSheetController} from "ionic-angular";
import {BottleService} from "../../components/bottle/bottle.service";
import {Bottle} from "../bottle/bottle";

@Component({
  selector: 'bottle-list',
  templateUrl: 'bottle-list.component.html',
  styleUrls: ['/bottle-list.component.scss']
})
export class BottleListComponent {

  isFilterPanelShown = false;
  @Input()
  bottles;

  @Output()
  showDetail: EventEmitter<Bottle> = new EventEmitter();

  constructor(private bottlesService: BottleService) {
  }

  filter() {
    this.isFilterPanelShown = true;
  }

  clicked(event:any) {
    console.info("carte de France cliquée !");
  }

  filterOn(filters: string) {
    this.isFilterPanelShown = false;
    console.info("filtering on " + filters);

    this.bottles=this.bottlesService.getBottles(filters);
  }

  triggerDetail(bottle: Bottle) {
    this.showDetail.emit(bottle);
  }
}

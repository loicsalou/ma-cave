import {Component, EventEmitter, Input, Output} from "@angular/core";
import {BottleService} from "../bottle/bottle-firebase.service";
import {Bottle} from "../bottle/bottle";
import {ListBottleEvent} from "./bottle-list-event";
import {ItemSliding, ToastController} from "ionic-angular";

@Component({
             selector: 'bottle-list',
             templateUrl: 'bottle-list.component.html',
             styleUrls: [ '/bottle-list.component.scss' ]
           })
export class BottleListComponent {
  isFilterPanelShown = false;
  @Input()
  bottles: Bottle[];

  @Output()
  showDetail: EventEmitter<ListBottleEvent> = new EventEmitter();

  private basket: Bottle[] = [];

  constructor(private bottlesService: BottleService, private toastCtrl: ToastController) {
  }

  filter() {
    this.isFilterPanelShown = true;
  }

  clicked(event: any) {
  }

  triggerDetail(bottle: Bottle, index: number) {
    this.showDetail.emit(<ListBottleEvent>{bottle: bottle, index: index});
  }

  color(bottle: Bottle) {
    return 'red';
  }

  isBottleInBasket(bottle: Bottle): boolean {
    return this.basket.filter(item => item === bottle).length == 1;
  }

  addToBasketOrRemove(event: Event, slidingItem: ItemSliding, bottle: Bottle) {
    event.stopPropagation();
    slidingItem.close();
    if (this.isBottleInBasket(bottle)) {
      this.basket=this.basket.filter(btl => btl != bottle);
      let basketToast = this.toastCtrl.create({
                                                message: 'la bouteille ' + bottle.nomCru + ' a été retirée du panier',
                                                duration: 2000,
                                                position: 'top'
                                              });
      basketToast.present();
    } else {
      this.basket.push(bottle);
      let basketToast = this.toastCtrl.create({
                                                message: 'la bouteille ' + bottle.nomCru + ' a été placée dans le' +
                                                ' panier',
                                                duration: 2000,
                                                position: 'top'
                                              });
      basketToast.present();
    }
  }
}

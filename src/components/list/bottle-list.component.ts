import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {Bottle} from '../../model/bottle';
import {ListBottleEvent} from './bottle-list-event';
import {ItemSliding, ToastController} from 'ionic-angular';

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

  constructor(private bottlesService: BottlePersistenceService, private toastCtrl: ToastController) {
  }

  filter() {
    this.isFilterPanelShown = true;
  }

  triggerDetail(bottle: Bottle, index: number) {
    this.showDetail.emit(<ListBottleEvent>{bottle: bottle, bottles: this.bottles, index: index});
  }

  switchSelected(event: Event, bottle: Bottle) {
    event.stopPropagation();
    bottle[ 'selected' ] = bottle[ 'selected' ] ? !bottle[ 'selected' ] : true;
  }

  isSelected(bottle) {
    return bottle[ 'selected' ];
  }

  isBottleFavorite(bottle: Bottle): boolean {
    return bottle.favorite;
  }

  addToFavoritesOrRemove(slidingBottle: SlidingBottle) {
    this.manageFavorites(slidingBottle.slidingItem, slidingBottle.bottle);
  }

  manageFavorites(slidingItem: ItemSliding, bottle: Bottle) {
    bottle.favorite = bottle.favorite ? !bottle.favorite : true;
    slidingItem.close();
    this.bottlesService.replaceBottle(bottle);
  }

  isBottleInBasket(bottle: Bottle): boolean {
    return bottle[ 'in-basket' ];
  }

  addToBasketOrRemove(event: Event, slidingItem: ItemSliding, bottle: Bottle) {
    event.stopPropagation();
    slidingItem.close();
    bottle[ 'in-basket' ] = bottle[ 'in-basket' ] ? !bottle[ 'in-basket' ] : true;
    if (this.isBottleInBasket(bottle)) {
      let basketToast = this.toastCtrl.create({
                                                message: 'la bouteille ' + bottle.nomCru + ' a été placée dans le' +
                                                ' panier',
                                                cssClass: 'information-message',
                                                duration: 2000,
                                                position: 'top'
                                              });
      basketToast.present();
    } else {
      let basketToast = this.toastCtrl.create({
                                                message: 'la bouteille ' + bottle.nomCru + ' a été retirée du panier',
                                                cssClass: 'information-message',
                                                duration: 2000,
                                                position: 'top'
                                              });
      basketToast.present();
    }
  }

  drawBottle(event: Event, slidingItem: ItemSliding, bottle: Bottle) {
    event.stopPropagation();
    slidingItem.close();
    let basketToast = this.toastCtrl.create({
                                              message: 'la bouteille ' + bottle.nomCru + ' a été retirée du stock',
                                              duration: 2000,
                                              cssClass: 'information-message',
                                              position: 'top'
                                            });
    basketToast.present();
  }
}

interface SlidingBottle {
  bottle: Bottle;
  slidingItem: ItemSliding;
}

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BottleService} from '../bottle/bottle-firebase.service';
import {Bottle} from '../bottle/bottle';
import {ListBottleEvent} from './bottle-list-event';
import {ItemSliding, ToastController} from 'ionic-angular';
import {Subject} from 'rxjs/Subject';

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

  private dragItem = new Subject<SlidingBottle>();

  constructor(private bottlesService: BottleService, private toastCtrl: ToastController) {
    this.dragItem.asObservable().debounceTime(50)
      .distinctUntilChanged()
      .subscribe(slidingBottle => this.addToFavoritesOrRemove(slidingBottle));
  }

  filter() {
    this.isFilterPanelShown = true;
  }

  triggerDetail(bottle: Bottle, index: number) {
    this.showDetail.emit(<ListBottleEvent>{bottle: bottle, bottles: this.bottles, index: index});
  }

  ionDrag(bottle: Bottle, item: ItemSliding) {
    let percent = item.getSlidingPercent();
    if (percent < 0 && Math.abs(percent) > 0.05) {
      this.dragItem.next(<SlidingBottle>{slidingItem: item, bottle: bottle});
    }
  }

  switchSelected(event: Event, bottle: Bottle) {
    event.stopPropagation();
    bottle[ 'selected' ] = bottle[ 'selected' ] ? !bottle[ 'selected' ] : true;
  }

  isSelected(bottle) {
    return bottle[ 'selected' ];
    //return this.selected.filter(item => item.id === bottle.id).length == 1;
  }

  isBottleFavorite(bottle: Bottle): boolean {
    return bottle.favorite;
    //return this.favorites.filter(item => item.id === bottle.id).length == 1;
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
    //return this.basket.filter(item => item.id === bottle.id).length == 1;
  }

  addToBasketOrRemove(event: Event, slidingItem: ItemSliding, bottle: Bottle) {
    event.stopPropagation();
    slidingItem.close();
    bottle[ 'in-basket' ] = bottle[ 'in-basket' ] ? !bottle[ 'in-basket' ] : true;
    if (this.isBottleInBasket(bottle)) {
      //this.basket = this.basket.filter(btl => btl.id != bottle.id);
      let basketToast = this.toastCtrl.create({
                                                message: 'la bouteille ' + bottle.nomCru + ' a été placée dans le' +
                                                ' panier',
                                                cssClass: 'information-message',
                                                duration: 2000,
                                                position: 'middle'
                                              });
      basketToast.present();
    } else {
      //this.basket.push(bottle);
      let basketToast = this.toastCtrl.create({
                                                message: 'la bouteille ' + bottle.nomCru + ' a été retirée du panier',
                                                cssClass: 'information-message',
                                                duration: 2000,
                                                position: 'middle'
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

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {Bottle} from '../../model/bottle';
import {ListBottleEvent} from './bottle-list-event';
import {ItemSliding, NavController, ToastController} from 'ionic-angular';
import {CellarPage} from '../../pages/cellar/cellar.page';
import {DeviceFeedback} from '@ionic-native/device-feedback';

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
  private nbSelected = 0;

  constructor(private bottlesService: BottlePersistenceService, private toastCtrl: ToastController,
              private navCtrl: NavController, private deviceFeedback: DeviceFeedback) {
  }

  filter() {
    this.isFilterPanelShown = true;
  }

  triggerDetail(bottle: Bottle, index: number) {
    this.showDetail.emit(<ListBottleEvent>{bottle: bottle, bottles: this.bottles, index: index});
  }

  switchSelected(event: Event, bottle: Bottle) {
    event.stopPropagation();
    bottle.selected = !bottle.selected;
    if (bottle.selected) {
      this.nbSelected++;
    } else {
      this.nbSelected--;
    }
  }

  numberNotPlaced(bottle: Bottle): number {
    return bottle.numberToBePlaced();
  }

  anyBottleSelected(): boolean {
    return this.nbSelected > 0;
  }

  isSelected(bottle) {
    return bottle.selected;
  }

  isBottleFavorite(bottle: Bottle): boolean {
    return bottle.favorite;
  }

  manageFavorites(slidingItem: ItemSliding, bottle: Bottle) {
    bottle.favorite = bottle.favorite ? !bottle.favorite : true;
    slidingItem.close();
    this.bottlesService.update([ bottle ]);
  }

  isBottleInBasket(bottle: Bottle): boolean {
    return bottle[ 'in-basket' ];
  }

  locateBottles(event: Event, slidingItem: ItemSliding, bottles: Bottle[]) {
    this.deviceFeedback.acoustic();
    this.deviceFeedback.haptic(0);
    event.stopPropagation();
    slidingItem.close();
    this.navCtrl.push(CellarPage, {bottlesToHighlight: bottles});
  }

  addToFavorite(event: Event, slidingItem: ItemSliding, bottle: Bottle) {
    this.deviceFeedback.acoustic();
    this.deviceFeedback.haptic(0);
    event.stopPropagation();
    bottle.favorite = bottle.favorite ? !bottle.favorite : true;
    this.bottlesService.update([bottle]);
    slidingItem.close();
  }

  resetSelection() {
    this.nbSelected = 0;
  }
}

interface SlidingBottle {
  bottle: Bottle;
  slidingItem: ItemSliding;
}

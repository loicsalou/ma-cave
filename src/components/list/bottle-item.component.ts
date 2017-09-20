import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {Bottle} from '../../model/bottle';
import {ItemSliding, NavController} from 'ionic-angular';
import {CellarPage} from '../../pages/cellar/cellar.page';
import {NativeProvider} from '../../providers/native/native';

@Component({
             selector: 'bottle-item',
             templateUrl: 'bottle-item.component.html',
             styleUrls: [ '/bottle-item.component.scss' ]
           })
export class BottleItemComponent {
  isFilterPanelShown = false;
  @Input()
  bottle: Bottle;
  @Output()
  showDetail: EventEmitter<Bottle> = new EventEmitter();
  private nbSelected = 0;

  constructor(private bottlesService: BottlePersistenceService,
              private navCtrl: NavController, private nativeProvider: NativeProvider) {
  }

  filter() {
    this.isFilterPanelShown = true;
  }

  triggerDetail(bottle: Bottle) {
    this.showDetail.emit(bottle);
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
    this.updateBottle(bottle);
  }

  updateBottle(bottle) {
    setTimeout(
      () => this.bottlesService.update([ bottle ]),
      10000
    );
  }

  isBottleInBasket(bottle: Bottle): boolean {
    return bottle[ 'in-basket' ];
  }

  locateBottles(event: Event, slidingItem: ItemSliding, bottles: Bottle[]) {
    this.nativeProvider.feedBack();
    event.stopPropagation();
    slidingItem.close();
    this.navCtrl.push(CellarPage, {bottlesToHighlight: bottles});
  }

  addToFavorite(event: Event, slidingItem: ItemSliding, bottle: Bottle) {
    this.nativeProvider.feedBack();
    event.stopPropagation();
    bottle.favorite = bottle.favorite ? !bottle.favorite : true;
    this.bottlesService.update([ bottle ]);
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
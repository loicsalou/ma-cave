import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {ItemSliding, NavController} from 'ionic-angular';
import {CellarPage} from '../../_features/racks/cellar/cellar.page';
import {NativeProvider} from '../../providers/native/native';
import {ApplicationState} from '../../app/state/app.state';
import {Store} from '@ngrx/store';
import {UpdateBottlesAction} from '../../app/state/bottles.actions';

@Component({
             selector: 'bottle-item',
             templateUrl: 'bottle-item.component.html'
             // styleUrls:[ 'bottle-item.component.scss' ]
           })
export class BottleItemComponent {
  isFilterPanelShown = false;
  @Input()
  bottle: Bottle;
  @Output()
  onShowDetail: EventEmitter<Bottle> = new EventEmitter();
  @Output()
  onSelected: EventEmitter<{ bottle: Bottle, selected: boolean }> = new EventEmitter();

  selected = false;

  constructor(private store: Store<ApplicationState>,
              private navCtrl: NavController, private nativeProvider: NativeProvider) {
  }

  filter() {
    this.isFilterPanelShown = true;
  }

  triggerDetail(bottle: Bottle) {
    this.onShowDetail.emit(bottle);
  }

  switchSelected() {
    event.stopPropagation();
    this.selected = !this.selected;
    this.onSelected.emit({bottle: this.bottle, selected: this.selected});
  }

  numberNotPlaced(bottle: Bottle): number {
    return bottle.quantite_courante - bottle.positions.length;
  }

  isSelected() {
    return this.selected;
  }

  isBottleFavorite(bottle: Bottle): boolean {
    return bottle.favorite;
  }

  locateBottles(event: Event, slidingItem: ItemSliding, bottles: Bottle[]) {
    this.nativeProvider.feedBack();
    event.stopPropagation();
    if (slidingItem) {
      slidingItem.close();
    }
    this.navCtrl.push(CellarPage, {bottlesToHighlight: bottles});
  }

  addToFavorite(event: Event, slidingItem: ItemSliding, bottle: Bottle) {
    this.nativeProvider.feedBack();
    event.stopPropagation();
    let updatedBottle = new Bottle(bottle);
    updatedBottle.favorite = !bottle.favorite;
    this.store.dispatch(new UpdateBottlesAction([updatedBottle]));
    slidingItem.close();
  }
}

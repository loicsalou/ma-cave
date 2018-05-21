import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {ItemSliding, NavController} from 'ionic-angular';
import {NativeProvider} from '../../providers/native/native';
import {ApplicationState} from '../../app/state/app.state';
import {Store} from '@ngrx/store';
import {
  HightlightBottleSelectionAction,
  SetSelectedBottleAction,
  UpdateBottlesAction
} from '../../app/state/bottles.actions';

@Component({
             selector: 'bottle-item',
             templateUrl: 'bottle-item.component.html'
             // styleUrls:[ 'bottle-item.component.scss' ]
           })
export class BottleItemComponent implements OnInit {
  isFilterPanelShown = false;
  @Input()
  bottle: Bottle;
  @Input()
  selected: boolean;
  @Output()
  onShowDetail: EventEmitter<Bottle> = new EventEmitter();
  @Output()
  onSelected: EventEmitter<{ bottle: Bottle, selected: boolean }> = new EventEmitter();

  constructor(private store: Store<ApplicationState>,
              private navCtrl: NavController, private nativeProvider: NativeProvider) {
  }

  ngOnInit() {
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
    setTimeout(() => this.onSelected.emit({bottle: this.bottle, selected: this.selected})
    );
  }

  numberNotPlaced(bottle: Bottle): number {
    return bottle.quantite_courante - bottle.positions.length;
  }

  isBottleFavorite(bottle: Bottle): boolean {
    return bottle.favorite;
  }

  locateBottle(event: Event, slidingItem: ItemSliding, bottle: Bottle) {
    this.nativeProvider.feedBack();
    event.stopPropagation();
    if (slidingItem) {
      slidingItem.close();
    }
    this.store.dispatch(new SetSelectedBottleAction(bottle, true));
    this.navCtrl.push('CellarPage', {action: new HightlightBottleSelectionAction()});
  }

  addToFavorite(event: Event, slidingItem: ItemSliding, bottle: Bottle) {
    this.nativeProvider.feedBack();
    event.stopPropagation();
    let updatedBottle = new Bottle(bottle);
    updatedBottle.favorite = !bottle.favorite;
    this.store.dispatch(new UpdateBottlesAction([ updatedBottle ]));
    slidingItem.close();
  }
}

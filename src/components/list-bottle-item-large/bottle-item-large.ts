import { Component } from '@angular/core';
import {BottleItemComponent} from '../list-bottle-item/bottle-item.component';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../app/state/app.state';
import {NavController} from 'ionic-angular';

/**
 * Generated class for the BottleItemLargeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bottle-item-large',
  templateUrl: 'bottle-item-large.html'
})
export class BottleItemLargeComponent extends BottleItemComponent {

  constructor(store: Store<ApplicationState>,
              navCtrl: NavController) {
    super(store, navCtrl);
  }

}

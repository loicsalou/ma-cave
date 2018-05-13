import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Bottle} from '../../../model/bottle';

@Component({
             selector: 'slide-bottle-detail',
             templateUrl: 'slide-bottle-detail.html',
             changeDetection: ChangeDetectionStrategy.OnPush
             // styleUrls:[ 'slide-bottle-detail.scss' ]
           })
export class BottleDetailSlide {

  //bouteille à afficher
  @Input()
  bottle: Bottle;
  @Input()
  showName: boolean;
  @Input()
  index: number;

  constructor(public navCtrl: NavController) {
  }

  imageChanged(event) {
  }

  imageWillChange(event) {
  }

  getIndex() {
    return this.index + 1;
  }
}

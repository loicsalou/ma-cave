import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Bottle} from '../../components/bottle/bottle';
import {UpdatePage} from '../update/update.page';

@Component({
             selector: 'slide-bottle-detail',
             templateUrl: 'slide-bottle-detail.html',
             styleUrls: [ '/slide-bottle-detail.scss' ]
           })
export class BottleDetailSlide {

  //bouteille à afficher
  @Input()
  bottle: Bottle;
  @Input()
  showName: boolean;
  @Input()
  index: number;
  @Output()
  onSlideLeft=new EventEmitter<Bottle>();
  @Output()
  onSlideRight=new EventEmitter<Bottle>();

  constructor(public navCtrl: NavController) {
  }

  getIndex() {
    return this.index + 1;
  }

  slideLeft() {
    this.onSlideLeft.emit(this.bottle);
  }

  slideRight() {
    this.onSlideRight.emit(this.bottle);
  }

  update() {
    this.navCtrl.push(UpdatePage, {bottle: this.bottle});
  }
}

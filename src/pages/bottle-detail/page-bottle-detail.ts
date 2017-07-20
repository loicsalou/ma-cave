import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {Bottle} from '../../model/bottle';
import {ListBottleEvent} from '../../components/list/bottle-list-event';
import {UpdatePage} from '../update/update.page';
import * as _ from 'lodash';
import {LoginService} from '../../service/login.service';

/*
 Generated class for the BottleDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
             selector: 'page-bottle-detail',
             templateUrl: 'page-bottle-detail.html',
             styleUrls: [ '/page-bottle-detail.scss' ]
           })
export class BottleDetailPage implements OnInit {
  private static SLIDES_BEFORE = 15;
  private static TOTAL_SLIDES = 30;

  //On ne crée les slides que pour ces bouteilles
  wholeSelection: Bottle[];
  slideBottles: Bottle[];

  //bouteille à afficher
  @Input()
  bottle: Bottle;

  @ViewChild(Slides) slides: Slides;

  //currently displayed index in the array of bottles
  currentIndex: number;
  private originalIndex: number;

  constructor(public navCtrl: NavController, navParams: NavParams, private loginService: LoginService) {
    let bottleEvent: ListBottleEvent = navParams.data[ 'bottleEvent' ];
    this.wholeSelection = bottleEvent.bottles;
    this.bottle = bottleEvent.bottle;
    this.originalIndex = bottleEvent.index;
  }

  ngOnInit(): void {
    this.slideBottles = this.extractSlideBottles(this.wholeSelection, this.originalIndex);
  }

  logout() {
    this.loginService.logout();
  }

  private extractSlideBottles(bottles: Bottle[], targetIndex: number): Bottle[] {
    let fromIndex = 0;
    if (targetIndex < BottleDetailPage.SLIDES_BEFORE) {
      fromIndex = 0;
      this.currentIndex = targetIndex;
    } else {
      fromIndex = targetIndex - BottleDetailPage.SLIDES_BEFORE;
      this.currentIndex = BottleDetailPage.SLIDES_BEFORE;
    }
    let toIndex = (fromIndex + BottleDetailPage.TOTAL_SLIDES > bottles.length ? bottles.length : fromIndex + BottleDetailPage.TOTAL_SLIDES);
    let ret = _.slice(bottles, fromIndex, toIndex);

    return ret;
  }

  update() {
    this.navCtrl.push(UpdatePage, {bottle: this.bottle});
  }

  ionViewDidEnter(): void {
    this.slides.slideTo(this.currentIndex);
  }

  slideChanged(event) {
    if (event.realIndex == undefined) {
      return;
    }
    this.currentIndex = event.realIndex;
    this.bottle = this.slideBottles[ this.currentIndex ];
  }

  lastSlideReached(event) {
  }

  firstSlideReached(event) {
  }
}

import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {Bottle} from '../../components/bottle/bottle';
import {ListBottleEvent} from '../../components/list/bottle-list-event';
import {UpdatePage} from '../update/update.page';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';

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
  //liste des bouteilles pour les slides
  @Input()
  bottles: Bottle[];

  //On ne crée les slides que pour ces bouteilles
  slideBottles: Bottle[];
  bottlesObservable: Observable<Bottle[]>;
  //bouteille à afficher
  @Input()
  bottle: Bottle;

  @ViewChild(Slides) slides: Slides;

  //currently displayed index in the array of bottles
  currentIndex: number;

  constructor(public navCtrl: NavController, navParams: NavParams) {
    let bottleEvent: ListBottleEvent = navParams.data[ 'bottleEvent' ];
    this.bottlesObservable = bottleEvent.bottles;
    this.bottle = bottleEvent.bottle;
    this.currentIndex = bottleEvent.index;
  }

  ngOnInit(): void {
    this.bottlesObservable.subscribe(bottles => {
      if (bottles.length > 0) {
        this.bottles = bottles;
        this.slideBottles = this.extractSlideBottles(this.currentIndex);
        this.bottle = this.bottles[ this.currentIndex ];
      }
    });
    this.slideBottles = this.extractSlideBottles(this.currentIndex);

  }

  private extractSlideBottles(currentIndex: number): Bottle[] {
    let fromIndex = (currentIndex < 1 ? 0 : currentIndex - 1);
    let toIndex = (fromIndex + 3 > this.bottles.length ? this.bottles.length : fromIndex + 3);
    let ret = _.slice(this.bottles, fromIndex, toIndex);
    console.info('from ' + fromIndex + ' to ' + toIndex + ': 1.' + ret[ 0 ].nomCru +
                 ' 2.' + ret[ 1 ].nomCru + ' 3.' + ret[ 2 ].nomCru);
    console.info('current=' + this.currentIndex + '.' + this.bottles[this.currentIndex].nomCru);

    return ret;
  }

  update() {
    this.navCtrl.push(UpdatePage, {bottle: this.bottle});
  }

  ionViewDidEnter(): void {
    this.slides.slideTo(this.currentIndex);
  }

  slideChanged(increment: number) {
    this.currentIndex += increment;
    this.bottle = this.bottles[ this.currentIndex ];
    this.slideBottles = this.extractSlideBottles(this.currentIndex);
  }

}

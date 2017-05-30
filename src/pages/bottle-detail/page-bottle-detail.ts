import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {Bottle} from '../../components/bottle/bottle';
import {ListBottleEvent} from '../../components/list/bottle-list-event';
import {UpdatePage} from '../update/update.page';
import {Observable} from 'rxjs/Observable';

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
      this.bottles = bottles;
      this.bottle = this.bottles[ this.currentIndex ];
    })
  }

  update() {
    this.navCtrl.push(UpdatePage, {bottle: this.bottle});
  }

  ionViewDidEnter(): void {
    this.slides.slideTo(this.currentIndex);
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
    this.bottle = this.bottles[ this.currentIndex ];
  }

}

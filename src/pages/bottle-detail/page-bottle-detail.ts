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
  private static SLIDES_BEFORE = 15;
  private static TOTAL_SLIDES = 30;

  //On ne crée les slides que pour ces bouteilles
  wholeSelection: Bottle[];
  slideBottles: Bottle[];
  bottlesObservable: Observable<Bottle[]>;

  //bouteille à afficher
  @Input()
  bottle: Bottle;

  @ViewChild(Slides) slides: Slides;

  //currently displayed index in the array of bottles
  currentIndex: number;
  private originalIndex: number;

  constructor(public navCtrl: NavController, navParams: NavParams) {
    let bottleEvent: ListBottleEvent = navParams.data[ 'bottleEvent' ];
    this.bottlesObservable = bottleEvent.bottles;
    this.bottle = bottleEvent.bottle;
    this.originalIndex = bottleEvent.index;
  }

  ngOnInit(): void {
    this.bottlesObservable.subscribe(bottles => {
      if (bottles.length > 0) {
        this.slideBottles = this.extractSlideBottles(bottles, this.originalIndex);
        this.wholeSelection = bottles;
      }
    });

  }

  private extractSlideBottles(bottles: Bottle[], targetIndex: number): Bottle[] {
    let fromIndex = 0;
    if (targetIndex < BottleDetailPage.SLIDES_BEFORE) {
      fromIndex = 0;
      this.currentIndex=targetIndex;
    } else {
      fromIndex = targetIndex - BottleDetailPage.SLIDES_BEFORE;
      this.currentIndex = BottleDetailPage.SLIDES_BEFORE;
    }
    let toIndex = (fromIndex + BottleDetailPage.TOTAL_SLIDES > bottles.length ? bottles.length : fromIndex + BottleDetailPage.TOTAL_SLIDES);
    let ret = _.slice(bottles, fromIndex, toIndex);
    //console.info('from ' + fromIndex + ' to ' + toIndex + ': 1.' + ret[ 0 ].nomCru +
    //             ' 2.' + ret[ 1 ].nomCru + ' 3.' + ret[ 2 ].nomCru);
    //console.info('current=' + this.currentIndex + '.' + bottles[this.currentIndex].nomCru);
    //this.bottle = ret[ this.currentIndex ];

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
    //la transition vers le dernier slide va avoir lieu. La bouteille courante n'est pas encore la dernière
    //console.info('last slide reached');
    //ne fonctionne pas franchement. Semble à peu près ok mais comme on est sur le dernier slide il faut que l'on
    // reposition l'index courant sur le slide au centre de la nouvelle collection sinon on n'aura plus d'evénement
    // lastSlideReached puisqu'on est déjà dessus.
    //this.slideBottles = this.extractSlideBottles(this.wholeSelection, this.originalIndex + this.currentIndex);
    //this.currentIndex=BottleDetailPage.SLIDES_BEFORE;
    //this.bottle=this.slideBottles[this.currentIndex];
  }

  firstSlideReached(event) {
    //console.info('first slide reached');
  }

}

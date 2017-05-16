import {Component, Input, ViewChild} from "@angular/core";
import {LoadingController, NavController, NavParams, Slides} from "ionic-angular";
import {Bottle} from "../../components/bottle/bottle";
import {ListBottleEvent} from "../../components/list/bottle-list-event";
import {UpdatePage} from "../update/update.page";

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
export class BottleDetailPage {
  //liste des bouteilles pour les slides
  @Input()
  bottles: Bottle[];
  //bouteille à afficher
  @Input()
  bottle: Bottle;

  @ViewChild(Slides) slides: Slides;

  //currently displayed index in the array of bottles
  currentIndex: number;

  constructor(public navCtrl: NavController, navParams: NavParams) {
    let bottleEvent: ListBottleEvent = navParams.data[ 'bottleEvent' ];
    this.bottles = bottleEvent.bottles;
    this.bottle = bottleEvent.bottle;
    this.currentIndex = bottleEvent.index;
  }

  update() {
    this.navCtrl.push(UpdatePage, {bottle: this.bottle});
  }

  ionViewDidEnter(): void {
    this.slides.slideTo(this.currentIndex);
  }

}

import {Component, Input} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Bottle} from "../../components/bottle/bottle";

/*
 Generated class for the BottleDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
             selector: 'page-bottle-detail',
             templateUrl: 'page-bottle-detail.html',
             styleUrls: ['/page-bottle-detail.scss']
           })
export class BottleDetailPage {
  //liste des bouteilles pour les slides
  @Input()
  bottles: Bottle[];

  //bouteille à afficher
  @Input()
  bottle: Bottle;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.info('------' + navParams);
    this.bottles = navParams.data[ 'bottles' ];
    this.bottle = navParams.data[ 'bottle' ];
    //TODO trouver comment positionner le slide correspondant à this.bottle en tant que slide courant
    //TODO voir aussi comment faire scroller le détail vu que tout ne rentre pas
    //TODO ajuster les marges top et bottom vu qu'apparemment il y a du padding dans le slide
  }

}

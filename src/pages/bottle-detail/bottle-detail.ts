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
  templateUrl: 'bottle-detail.html',
  styleUrls: ['/bottle-detail.scss']
})
export class BottleDetailPage {
  //liste des bouteilles pour les slides
  @Input()
  bottles: Bottle[];

  //bouteille à afficher
  @Input()
  bottle: Bottle;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.info('------'+navParams);
    this.bottle=navParams.data['bottle'];
  }

}

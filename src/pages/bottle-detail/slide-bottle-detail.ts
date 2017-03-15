import {Component, Input} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Bottle} from "../../components/bottle/bottle";

@Component({
  selector: 'slide-bottle-detail',
  templateUrl: 'slide-bottle-detail.html',
  styleUrls: ['/slide-bottle-detail.scss']
})
export class BottleDetailSlide {

  //bouteille à afficher
  @Input()
  bottle: Bottle;
  @Input()
  showName: boolean = true;

  constructor(public navCtrl: NavController) {
  }

}

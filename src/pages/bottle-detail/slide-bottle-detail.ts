import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {Bottle} from "../../components/bottle/bottle";
import {UpdatePage} from "../update/update";

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
  showName: boolean = true;
  @Input()
  index: number;

  constructor(public navCtrl: NavController) {
  }

  getIndex() {
    return this.index + 1;
  }
}

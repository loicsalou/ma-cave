import {Component} from "@angular/core";
import {Bottle} from "../../components/bottle/bottle";
import {NavController, NavParams} from "ionic-angular";

/*
 Generated class for the Update component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
             selector: 'update',
             templateUrl: 'update.html'
           })
export class UpdatePage {

  bottle: Bottle;

  constructor(navCtrl: NavController, navParams: NavParams) {
    this.bottle = navParams.data[ 'bottle' ];
  }

}

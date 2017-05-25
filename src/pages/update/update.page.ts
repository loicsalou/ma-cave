import {Component, ViewEncapsulation} from "@angular/core";
import {Bottle} from "../../components/bottle/bottle";
import {NavController, NavParams} from "ionic-angular";

/*
 Generated class for the Update component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
             selector: 'update',
             templateUrl: '/update.page.html',
             styleUrls: [ '/update.page.scss' ],
             // warning: few browsers support shadow DOM encapsulation at this time
             encapsulation: ViewEncapsulation.Emulated
           })
export class UpdatePage {

  bottle: Bottle;

  constructor(navCtrl: NavController, navParams: NavParams) {
    this.bottle = navParams.data[ 'bottle' ];
  }

}
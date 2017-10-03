import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Bottle} from '../../model/bottle';
import {TranslateService} from '@ngx-translate/core';
import {BottleNoting} from '../../components/bottle-noting/bottle-noting.component';

/**
 * Generated class for the RecordOutputPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
             selector: 'page-record-output',
             templateUrl: './record-output.html',
             styleUrls: [ '/record-output.scss' ]
           })
export class RecordOutputPage {

  bottle: Bottle;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translateService: TranslateService) {
    this.bottle = navParams.data[ 'bottle' ];
  }

  bottleNoted(bottle: Bottle, notes: BottleNoting) {
    alert('quality:' + notes.quality.note + '\nmaturity:' + notes.maturity.note + '\npleasurePrice:' +
      notes.pleasurePrice.note + '\ncomments:' + notes.comments)
  }
}

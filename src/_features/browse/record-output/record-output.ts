import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from '@ionic/angular';
import {Bottle} from '../../../model/bottle';
import {BottleNoting} from '../../../components/bottle-noting/bottle-noting.component';
import {BottlePersistenceService} from '../../../service/bottle-persistence.service';

/**
 * Generated class for the RecordOutputPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
             templateUrl: './record-output.html',
             // styleUrls:[ 'record-output.scss' ]
           })
export class RecordOutputPage {

  bottle: Bottle;

  constructor(public navCtrl: NavController, public bottleService: BottlePersistenceService, public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.bottle = navParams.data[ 'bottle' ];
  }

  bottleNoted(bottle: Bottle, notes: BottleNoting) {
    if (!notes) {
      this.viewCtrl.dismiss(notes);
    } else {
      if (this.validateNotes(notes)) {
        this.bottleService.saveBottleNotation(bottle, notes);
        this.viewCtrl.dismiss(notes);
      }
    }
  }

  private validateNotes(notes: BottleNoting) {
    if (notes.comments === undefined) {
      notes.comments = '';
    }
    if (!(notes.pleasurePrice && notes.maturity && notes.quality)) {
      return undefined;
    }
    return notes;
  }
}

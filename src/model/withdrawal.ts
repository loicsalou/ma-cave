import {Bottle} from './bottle';
import {BottleNoting} from '../components/bottle-noting/bottle-noting.component';
import * as moment from 'moment';

export class Withdrawal extends Bottle {

  withdrawal_date: string;
  notation?: BottleNoting;

  constructor(bottle: Bottle, note?: BottleNoting) {
    super(bottle);
    this.withdrawal_date = moment().format('YYYY-MM-DD HH:mm:ss');
    if (note) {
      this.notation = note;
    }
  }
}

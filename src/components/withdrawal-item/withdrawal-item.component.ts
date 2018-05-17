import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Withdrawal} from '../../model/withdrawal';
import * as moment from 'moment';

@Component({
             selector: 'withdrawal-item',
             templateUrl: 'withdrawal-item.component.html'
             // styleUrls:[ 'withdrawal-item.component.scss' ]
           })
export class WithdrawalItemComponent implements OnInit {
  @Input()
  withdrawal: Withdrawal;
  @Output()
  showDetail: EventEmitter<Withdrawal> = new EventEmitter();
  fromNow: string;

  constructor() {
    moment.updateLocale('fr', {
      relativeTime : {
        future: "dans %s",
        past:   "%s",
        s  : 'à l\'instant',
        ss : '%d s',
        m:  "1 mn",
        mm: "%d mn",
        h:  "1 h",
        hh: "%d h",
        d:  "hier",
        dd: "%d j",
        M:  "1 mo",
        MM: "%d mo",
        y:  "1 an",
        yy: "%d ans"
      }
    });
  }

  ngOnInit() {
    let withdrawMoment = moment(this.withdrawal.withdrawal_date);
    this.fromNow = withdrawMoment.fromNow();
  }

  triggerDetail(withdrawal: Withdrawal) {
    this.showDetail.emit(withdrawal);
  }

  isBottleFavorite(withdrawal: Withdrawal): boolean {
    return withdrawal.favorite;
  }
}

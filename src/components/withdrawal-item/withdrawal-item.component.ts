import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Withdrawal} from '../../model/withdrawal';

@Component({
             selector: 'withdrawal-item',
             templateUrl: 'withdrawal-item.component.html',
             // styleUrls:[ 'withdrawal-item.component.scss' ]
           })
export class WithdrawalItemComponent {
  @Input()
  withdrawal: Withdrawal;
  @Output()
  showDetail: EventEmitter<Withdrawal> = new EventEmitter();

  constructor() {
  }

  triggerDetail(withdrawal: Withdrawal) {
    this.showDetail.emit(withdrawal);
  }

  isBottleFavorite(withdrawal: Withdrawal): boolean {
    return withdrawal.favorite;
  }
}

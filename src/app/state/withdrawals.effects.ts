import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {
  BottlesActionTypes,
  LoadBottlesSuccessAction,
  UpdateBottlesAction,
  UpdateBottleSuccessAction
} from './bottles.actions';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {map, switchMap} from 'rxjs/operators';
import {Bottle} from '../../model/bottle';
import {LoadWithdrawalsSuccessAction, WithdrawalsActions, WithdrawalsActionTypes} from './withdrawals.actions';
import {Withdrawal} from '../../model/withdrawal';

@Injectable()
export class WithdrawalsEffectsService {

  @Effect() getWithdrawals$ = this.actions$
    .ofType(WithdrawalsActionTypes.LoadWithdrawalsActionType).pipe(
      switchMap(() => this.withdrawalsService.fetchAllWithdrawals()),
      map((withdrawals: Withdrawal[]) =>
            new LoadWithdrawalsSuccessAction(withdrawals))
    );

  constructor(private actions$: Actions, private withdrawalsService: BottlePersistenceService) {
  }

}

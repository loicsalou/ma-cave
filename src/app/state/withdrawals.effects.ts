import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {map, switchMap} from 'rxjs/operators';
import {
  CreateOrUpdateWithdrawalAction, CreateOrUpdateWithdrawalSuccessAction,
  LoadWithdrawalsSuccessAction,
  WithdrawalsActionTypes
} from './withdrawals.actions';
import {Withdrawal} from '../../model/withdrawal';

@Injectable()
export class WithdrawalsEffectsService {

  @Effect() getWithdrawals$ = this.actions$
    .ofType(WithdrawalsActionTypes.LoadWithdrawalsActionType).pipe(
      switchMap(() => this.withdrawalsService.fetchAllWithdrawals()),
      map((withdrawals: Withdrawal[]) =>
            new LoadWithdrawalsSuccessAction(withdrawals))
    );

  @Effect() createOrUpdateWithdrawal$ = this.actions$
    .ofType(WithdrawalsActionTypes.CreateOrUpdateWithdrawalActionType).pipe(
      switchMap((action:CreateOrUpdateWithdrawalAction) => this.withdrawalsService.saveWithdrawal(action.withdrawal)),
      map((withdrawal: Withdrawal) =>
            new CreateOrUpdateWithdrawalSuccessAction(withdrawal))
    );

  constructor(private actions$: Actions, private withdrawalsService: BottlePersistenceService) {
  }

}

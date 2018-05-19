import {Action} from '@ngrx/store';
import {Bottle} from '../../model/bottle';
import {Withdrawal} from '../../model/withdrawal';

export enum WithdrawalsActionTypes {
  CreateOrUpdateWithdrawalActionType = '[withdrawals] - create or update',
  CreateOrUpdateWithdrawalSuccessActionType = '[withdrawals] - create or update success',
  LoadWithdrawalsActionType = '[withdrawals] - loading',
  LoadWithdrawalsFailedActionType = '[withdrawals] - loading failed',
  LoadWithdrawalsSuccessActionType = '[withdrawals] - loading success'
}

export type WithdrawalsActions = CreateOrUpdateWithdrawalAction
  | CreateOrUpdateWithdrawalSuccessAction
  | LoadWithdrawalsFailedAction
  | LoadWithdrawalsSuccessAction
  | LoadWithdrawalsAction;

/**
 * Chargement des sorties
 */
export class LoadWithdrawalsAction implements Action {
  readonly type = WithdrawalsActionTypes.LoadWithdrawalsActionType;
}

export class LoadWithdrawalsSuccessAction implements Action {
  readonly type = WithdrawalsActionTypes.LoadWithdrawalsSuccessActionType;

  constructor(public withdrawals: Withdrawal[]) {
  }
}

export class LoadWithdrawalsFailedAction implements Action {
  readonly type = WithdrawalsActionTypes.LoadWithdrawalsFailedActionType;

  constructor(public error: any) {
  }
}

/**
 * Sortie ou mise à jour d'une bouteille
 */
export class CreateOrUpdateWithdrawalAction implements Action {
  readonly type = WithdrawalsActionTypes.CreateOrUpdateWithdrawalActionType;

  constructor(public withdrawal: Withdrawal) {
  }
}

export class CreateOrUpdateWithdrawalSuccessAction implements Action {
  readonly type = WithdrawalsActionTypes.CreateOrUpdateWithdrawalSuccessActionType;

  constructor(public withdrawal: Withdrawal) {
  }
}

import {Action} from '@ngrx/store';
import {Locker} from '../../model/locker';

export enum CellarActionTypes {
  LoadCellarActionType = '[cellar] - loading',
  LoadCellarSuccessActionType = '[cellar] - loading success',
  LoadCellarFailedActionType = '[cellar] - loading failed',
}

export type CellarActions = LoadCellarAction
  | LoadCellarSuccessAction
  | LoadCellarFailedAction;

/**
 * Chargement des casiers
 */
export class LoadCellarAction implements Action {
  readonly type = CellarActionTypes.LoadCellarActionType;
}

export class LoadCellarSuccessAction implements Action {
  readonly type = CellarActionTypes.LoadCellarSuccessActionType;

  constructor(public lockers: Locker[]) {
  }
}

export class LoadCellarFailedAction implements Action {
  readonly type = CellarActionTypes.LoadCellarFailedActionType;

  constructor(public error: any) {
  }
}

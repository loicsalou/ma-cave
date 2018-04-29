import {Action} from '@ngrx/store';
import {Bottle} from '../../model/bottle';

export enum BottlesActionTypes {
  LoadBottlesActionType = '[bottles] - loading',
  LoadBottlesSuccessActionType = '[bottles] - loading success',
  LoadBottlesFailedActionType = '[bottles] - loading failed',
  CreateBottleActionType = '[bottles] - create bottle',
  UpdateBottlesActionType = '[bottles] - change bottle',
  DrawBottlesActionType = '[bottles] - draw bottles'
}

export type BottlesActions = LoadBottlesAction
  | LoadBottlesSuccessAction
  | LoadBottlesFailedAction
  | CreateBottleAction
  | UpdateBottleAction
  | DrawBottlesAction;

/**
 * Chargement des bouteilles
 */
export class LoadBottlesAction implements Action {
  readonly type = BottlesActionTypes.LoadBottlesActionType;
}

export class LoadBottlesSuccessAction implements Action {
  readonly type = BottlesActionTypes.LoadBottlesSuccessActionType;

  constructor(public bottles: Bottle[]) {
  }
}

export class LoadBottlesFailedAction implements Action {
  readonly type = BottlesActionTypes.LoadBottlesFailedActionType;

  constructor(public error: any) {
  }
}

/**
 * Création d'une bouteille
 */
export class CreateBottleAction implements Action {
  readonly type = BottlesActionTypes.CreateBottleActionType;

  constructor(public bottle: Bottle) {
  }
}

/**
 * Mise à jour d'une bouteille
 */
export class UpdateBottleAction implements Action {
  readonly type = BottlesActionTypes.UpdateBottlesActionType;

  constructor(public bottle: Bottle) {
  }
}

/**
 * Sortie d'une bouteille
 */
export class DrawBottlesAction implements Action {
  readonly type = BottlesActionTypes.DrawBottlesActionType;

  constructor(public bottle: Bottle) {
  }
}

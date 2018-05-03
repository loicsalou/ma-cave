import {Action} from '@ngrx/store';
import {Bottle} from '../../model/bottle';
import {FilterSet} from '../../components/distribution/filterset';

export enum BottlesActionTypes {
  LoadBottlesActionType = '[bottles] - loading',
  LoadBottlesSuccessActionType = '[bottles] - loading success',
  LoadBottlesFailedActionType = '[bottles] - loading failed',
  CreateBottleActionType = '[bottles] - create bottle',
  UpdateBottlesActionType = '[bottles] - update bottles',
  UpdateBottlesSuccessActionType = '[bottles] - update bottles success',
  DrawBottlesActionType = '[bottles] - draw bottles',
  UpdateFilterActionType = '[filter] - changed',
  RemoveFilterActionType = '[filter] - remove',
  ResetFilterActionType = '[filter] - reset',
  ResetBottleSelectionActionType = '[bottles] - reset selection',
  SelectBottleActionType = '[bottles] - reset'
}

export type BottlesActions = LoadBottlesAction
  | LoadBottlesSuccessAction
  | LoadBottlesFailedAction
  | CreateBottleAction
  | UpdateBottlesAction
  | UpdateBottleSuccessAction
  | DrawBottlesAction
  | UpdateFilterAction
  | RemoveFilterAction
  | ResetFilterAction
  | ResetBottleSelectionAction
  | SelectBottleAction;

/**
 * Mise à jour du filtre
 */
export class UpdateFilterAction implements Action {
  readonly type = BottlesActionTypes.UpdateFilterActionType;

  constructor(public newFilter: FilterSet) {
  }
}

export class RemoveFilterAction implements Action {
  readonly type = BottlesActionTypes.RemoveFilterActionType;

  constructor(public keywords: string[]) {
  }
}

/**
 * Reset du filtre
 */
export class ResetFilterAction implements Action {
  readonly type = BottlesActionTypes.ResetFilterActionType;
}

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
export class UpdateBottlesAction implements Action {
  readonly type = BottlesActionTypes.UpdateBottlesActionType;

  constructor(public bottle: Bottle[]) {
  }
}

/**
 * Mise à jour d'une bouteille
 */
export class UpdateBottleSuccessAction implements Action {
  readonly type = BottlesActionTypes.UpdateBottlesSuccessActionType;

  constructor(public bottles: Bottle[]) {}
}

/**
 * Sélection d'une bouteille pour travailler dessus (ex. pour les sorties, les rangements, les suppressions...)
 * Cette action est en général déclenchée depuis la liste de bouteilles.
 */
export class ResetBottleSelectionAction implements Action {
  readonly type = BottlesActionTypes.ResetBottleSelectionActionType;
}

/**
 * Sélection d'une bouteille pour travailler dessus (ex. pour les sorties, les rangements, les suppressions...)
 * Cette action est en général déclenchée depuis la liste de bouteilles.
 */
export class SelectBottleAction implements Action {
  readonly type = BottlesActionTypes.SelectBottleActionType;

  constructor(public bottle: Bottle, public selected: boolean) {
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

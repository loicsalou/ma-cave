import {Action} from '@ngrx/store';
import {Bottle, Position} from '../../model/bottle';
import {FilterSet} from '../../components/distribution/filterset';
import {Locker} from '../../model/locker';

export enum BottlesActionTypes {
  CreateBottleActionType = '[bottles] - create bottle',
  DrawBottlesActionType = '[bottles] - draw bottles',
  LoadBottlesActionType = '[bottles] - loading',
  LoadBottlesSuccessActionType = '[bottles] - loading success',
  LoadBottlesFailedActionType = '[bottles] - loading failed',
  PlaceBottleSelectionActionType = '[bottles] - place selection',
  HighlightBottleSelectionActionType = '[bottles] - highlight selection',
  ResetBottleSelectionActionType = '[bottles] - reset selection',
  SetSelectedBottleActionType = '[bottles] - select',
  UnselectBottlesActionType = '[bottles] - unselect all',
  FixBottlesActionType = '[bottles] - fix bogus bottles',
  UpdateBottlesActionType = '[bottles] - update bottles',
  UpdateBottlesSuccessActionType = '[bottles] - update bottles success',
  WithdrawBottleActionType = '[bottles] - withdraw bottle',
  WithdrawBottleSuccessActionType = '[bottles] - withdraw bottle success',

  UpdateFilterActionType = '[filter] - changed',
  RemoveFilterActionType = '[filter] - remove',
  ResetFilterActionType = '[filter] - reset',

  LoadCellarActionType = '[cellar] - loading',
  LoadCellarSuccessActionType = '[cellar] - loading success',
  LoadCellarFailedActionType = '[cellar] - loading failed',
  UpdateLockerActionType = '[cellar] - update locker',
  EditLockerActionType = '[cellar] - edit locker',
  LockerWasUpdatedActionType = '[cellar] - locker updated',
}

export type BottlesActions =
  CreateBottleAction
  | EditLockerAction
  | FixBottlesAction
  | LoadBottlesAction
  | LoadBottlesSuccessAction
  | LoadBottlesFailedAction
  | LoadCellarAction
  | LoadCellarSuccessAction
  | LoadCellarFailedAction
  | LockerWasUpdatedAction
  | PlaceBottleSelectionAction
  | HightlightBottleSelectionAction
  | RemoveFilterAction
  | ResetFilterAction
  | ResetBottleSelectionAction
  | SetSelectedBottleAction
  | UnselectBottlesAction
  | UpdateBottlesAction
  | UpdateBottlesSuccessAction
  | UpdateFilterAction
  | UpdateLockerAction
  | WithdrawBottleAction
  | WithdrawBottleSuccessAction;

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

export class UpdateBottlesSuccessAction implements Action {
  readonly type = BottlesActionTypes.UpdateBottlesSuccessActionType;

  constructor(public bottles: Bottle[]) {
  }
}

export class FixBottlesAction implements Action {
  readonly type = BottlesActionTypes.FixBottlesActionType;

  constructor(public bugs: { bottle: Bottle, unsupportedAttrs: string[] }[]) {
  }
}

/**
 * Sélection d'une bouteille pour travailler dessus (ex. pour les sorties, les rangements, les suppressions...)
 * Cette action est en général déclenchée depuis la liste de bouteilles.
 */
export class ResetBottleSelectionAction implements Action {
  readonly type = BottlesActionTypes.ResetBottleSelectionActionType;
}

export class SetSelectedBottleAction implements Action {
  readonly type = BottlesActionTypes.SetSelectedBottleActionType;

  constructor(public bottle: Bottle, public selected: boolean) {
  }
}

export class UnselectBottlesAction implements Action {
  readonly type = BottlesActionTypes.UnselectBottlesActionType;

  constructor() {
  }
}

export class PlaceBottleSelectionAction implements Action {
  readonly type = BottlesActionTypes.PlaceBottleSelectionActionType;
}

export class HightlightBottleSelectionAction implements Action {
  readonly type = BottlesActionTypes.HighlightBottleSelectionActionType;
}

/**
 * Sortie d'une bouteille
 */
export class WithdrawBottleAction implements Action {
  readonly type = BottlesActionTypes.WithdrawBottleActionType;

  constructor(public bottle: Bottle, public position: Position) {
  }
}

export class WithdrawBottleSuccessAction implements Action {
  readonly type = BottlesActionTypes.WithdrawBottleSuccessActionType;

  constructor(public bottle: Bottle) {
  }
}

/**
 * Gestion des casiers
 */
export class UpdateLockerAction implements Action {
  readonly type = BottlesActionTypes.UpdateLockerActionType;

  constructor(public locker: Locker, public bottles: Bottle[]) {
  }
}

export class EditLockerAction implements Action {
  readonly type = BottlesActionTypes.EditLockerActionType;

  constructor(public locker: Locker) {
  }
}

export class LockerWasUpdatedAction implements Action {
  readonly type = BottlesActionTypes.LockerWasUpdatedActionType;

  constructor(public bottles: Bottle[], public locker: Locker) {
  }
}

/**
 * Chargement des casiers
 */
export class LoadCellarAction implements Action {
  readonly type = BottlesActionTypes.LoadCellarActionType;
}

export class LoadCellarSuccessAction implements Action {
  readonly type = BottlesActionTypes.LoadCellarSuccessActionType;

  constructor(public lockers: Locker[]) {
  }
}

export class LoadCellarFailedAction implements Action {
  readonly type = BottlesActionTypes.LoadCellarFailedActionType;

  constructor(public error: any) {
  }
}

import {Action} from '@ngrx/store';
import {Withdrawal} from '../../model/withdrawal';
import {SearchCriteria} from '../../model/search-criteria';

export enum SharedActionTypes {
  LoadSharedActionType = '[shared] - load',
  LoadSharedFailedType = '[shared] - load failed',
  LoadSharedSuccessActionType = '[shared] - load success'
}

export type SharedActions = LoadSharedAction
  | LoadSharedFailedAction
  | LoadSharedSuccessAction;

/**
 * Chargement des sorties
 */
export class LoadSharedAction implements Action {
  readonly type = SharedActionTypes.LoadSharedActionType;
}

export class LoadSharedSuccessAction implements Action {
  readonly type = SharedActionTypes.LoadSharedSuccessActionType;

  constructor(public queries: SearchCriteria[]) {
  }
}

export class LoadSharedFailedAction implements Action {
  readonly type = SharedActionTypes.LoadSharedFailedType;

  constructor(public error: any) {
  }
}

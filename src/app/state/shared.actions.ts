import {Action} from '@ngrx/store';
import {UserPreferences} from '../../model/user-preferences';

export enum SharedActionTypes {
  LoadSharedActionType = '[shared] - load',
  LoadSharedFailedType = '[shared] - load failed',
  LoadSharedSuccessActionType = '[shared] - load success',
  UpdateThemeActionType = '[shared] - update theme',
  UpdateMostUsedQueriesActionType = '[shared] - update most used queries',
}

export type SharedActions = LoadSharedAction
  | LoadSharedFailedAction
  | LoadSharedSuccessAction
  | UpdateThemeAction
  | UpdateMostUsedQueriesAction;

/**
 * Chargement des sorties
 */
export class LoadSharedAction implements Action {
  readonly type = SharedActionTypes.LoadSharedActionType;
}

export class LoadSharedSuccessAction implements Action {
  readonly type = SharedActionTypes.LoadSharedSuccessActionType;

  constructor(public prefs: UserPreferences) {
  }
}

export class LoadSharedFailedAction implements Action {
  readonly type = SharedActionTypes.LoadSharedFailedType;

  constructor(public error: any) {
  }
}

export class UpdateThemeAction implements Action {
  readonly type = SharedActionTypes.UpdateThemeActionType;

  constructor(public theme: string) {
  }
}

export class UpdateMostUsedQueriesAction implements Action {
  readonly type = SharedActionTypes.UpdateMostUsedQueriesActionType;

  constructor(public keywords: string[]) {
  }
}

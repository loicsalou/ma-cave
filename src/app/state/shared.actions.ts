import {Action} from '@ngrx/store';
import {UserPreferences} from '../../model/user-preferences';

export enum SharedActionTypes {
  LoadSharedActionType = '[shared] - load',
  LoadSharedFailedType = '[shared] - load failed',
  LoadSharedSuccessActionType = '[shared] - load success',
  LoginActionType = '[shared] - login',
  LoginActionFailType = '[shared] - login fail',
  LoginActionSuccessType = '[shared] - login success',
  LogoutActionType = '[shared] - logout',
  DeleteAccountActionType = '[shared] - logout',
  UpdateThemeActionType = '[shared] - update theme',
  UpdateMostUsedQueriesActionType = '[shared] - update most used queries',
}

export type SharedActions = LoadSharedAction
  | LoadSharedFailedAction
  | LoadSharedSuccessAction
  | LoginAction
  | LoginSuccessAction
  | LoginFailAction
  | LogoutAction
  | DeleteAccountAction
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

/* LOGIN actions */
export class LoginAction implements Action {
  readonly type = SharedActionTypes.LoginActionType;
}

export class LoginFailAction implements Action {
  readonly type = SharedActionTypes.LoginActionFailType;
}

export class LoginSuccessAction implements Action {
  readonly type = SharedActionTypes.LoginActionSuccessType;
}

export class LogoutAction implements Action {
  readonly type = SharedActionTypes.LogoutActionType;
}

export class DeleteAccountAction implements Action {
  readonly type = SharedActionTypes.DeleteAccountActionType;
}


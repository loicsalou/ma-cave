import {Action} from '@ngrx/store';
import {UserPreferences} from '../../model/user-preferences';
import {User} from '../../model/user';
import {LOGINTYPE} from '../../service/login/login.service';
import {BOTTLE_ITEM_TYPE} from './shared.state';

export enum SharedActionTypes {
  LoadSharedActionType = '[shared] - load',
  LoadSharedFailedType = '[shared] - load failed',
  LoadSharedSuccessActionType = '[shared] - load success',
  LoginActionType = '[shared] - login',
  LoginActionFailType = '[shared] - login fail',
  LoginActionSuccessType = '[shared] - login success',
  LogoutActionType = '[shared] - logout',
  DeleteAccountActionType = '[shared] - delete account',
  UpdatePrefsActionType = '[shared] - update preferences',
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
  | UpdatePrefsAction
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

export class UpdatePrefsAction implements Action {
  readonly type = SharedActionTypes.UpdatePrefsActionType;

  constructor(public theme: string, public itemType: BOTTLE_ITEM_TYPE) {
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

  constructor(public loginType: LOGINTYPE, public user = '', public password = '') {
    this.loginType = loginType;
  }
}

export class LoginFailAction implements Action {
  readonly type = SharedActionTypes.LoginActionFailType;

  constructor(public error) {
  }
}

export class LoginSuccessAction implements Action {
  readonly type = SharedActionTypes.LoginActionSuccessType;

  constructor(public user: User) {
  }
}

export class LogoutAction implements Action {
  readonly type = SharedActionTypes.LogoutActionType;
}

export class DeleteAccountAction implements Action {
  readonly type = SharedActionTypes.DeleteAccountActionType;
}


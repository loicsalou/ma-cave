import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {
  DeleteAccountAction,
  LoadSharedAction,
  LoadSharedSuccessAction,
  LoginAction,
  LoginFailAction,
  LoginSuccessAction,
  LogoutAction,
  SharedActionTypes,
  UpdateMostUsedQueriesAction,
  UpdateThemeAction
} from './shared.actions';
import {SharedPersistenceService} from '../../service/shared-persistence.service';
import {UserPreferences} from '../../model/user-preferences';
import {LoginService} from '../../service/login/login.service';
import {User} from '../../model/user';
import {logInfo} from '../../utils';

@Injectable()
export class SharedEffectsService {

  @Effect() login$ = this.actions$
    .ofType(SharedActionTypes.LoginActionType).pipe(
      switchMap((action: LoginAction) =>
                  this.loginService.login(action.loginType, action.user, action.password)
      ),
      map((user: User) => new LoginSuccessAction(user))
    );

  @Effect({dispatch: false}) loginSuccess$ = this.actions$
    .ofType(SharedActionTypes.LoginActionSuccessType).pipe(
      tap((action: LoginSuccessAction) => {
            logInfo('LoginSuccessAction');
          }
      )
    );

  @Effect({dispatch: false}) logoutAction$ = this.actions$
    .ofType(SharedActionTypes.LogoutActionType).pipe(
      tap((action: LogoutAction) => {
            this.loginService.logout();
          }
      )
    );

  @Effect() getShared$ = this.actions$
    .ofType(SharedActionTypes.LoadSharedActionType).pipe(
      switchMap(() =>
                  this.sharedServices.getUserPreferences()),
      map((prefs: UserPreferences) =>
            new LoadSharedSuccessAction(prefs))
    );

  @Effect() updateTheme$ = this.actions$
    .ofType(SharedActionTypes.UpdateThemeActionType).pipe(
      tap((action: UpdateThemeAction) => this.sharedServices.updateTheme(action.theme)),
      map(() => new LoadSharedAction())
    );

  @Effect({dispatch: false}) updateQueries$ = this.actions$
    .ofType(SharedActionTypes.UpdateMostUsedQueriesActionType).pipe(
      tap((action: UpdateMostUsedQueriesAction) => this.sharedServices.updateQueryStats(action.keywords))
    );

  @Effect({dispatch: false}) deleteAccount$ = this.actions$
    .ofType(SharedActionTypes.DeleteAccountActionType).pipe(
      tap((action: DeleteAccountAction) => this.withdrawalsService.deleteAccountData().subscribe(
        result => this.loginService.deleteAccount()
          )
      )
    );

  constructor(private actions$: Actions, private withdrawalsService: BottlePersistenceService,
              private sharedServices: SharedPersistenceService, private loginService: LoginService) {
  }

}

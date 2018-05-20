import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {
  DeleteAccountAction,
  LoadSharedAction,
  LoadSharedSuccessAction,
  LoginSuccessAction,
  SharedActionTypes,
  UpdateMostUsedQueriesAction,
  UpdateThemeAction
} from './shared.actions';
import {SharedPersistenceService} from '../../service/shared-persistence.service';
import {UserPreferences} from '../../model/user-preferences';
import {LoginService} from '../../service/login/login.service';
import {environment} from '../../environments/environment';
import {setLogLevel} from '../../utils';

@Injectable()
export class SharedEffectsService {

  @Effect({dispatch: false}) loginSuccess$ = this.actions$
    .ofType(SharedActionTypes.LoginActionSuccessType).pipe(
      tap((action: LoginSuccessAction) => {
            if (!environment.production) {
              setLogLevel('INFO');
            }
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

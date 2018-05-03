import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {
  DeleteAccountAction,
  LoadSharedSuccessAction,
  LogoutAction,
  SharedActionTypes,
  UpdateMostUsedQueriesAction,
  UpdateThemeAction
} from './shared.actions';
import {SharedPersistenceService} from '../../service/shared-persistence.service';
import {UserPreferences} from '../../model/user-preferences';
import {LoginService} from '../../service/login/login.service';

@Injectable()
export class SharedEffectsService {

  @Effect() getShared$ = this.actions$
    .ofType(SharedActionTypes.LoadSharedActionType).pipe(
      switchMap(() =>
                  this.sharedServices.getUserPreferences()),
      map((prefs: UserPreferences) =>
            new LoadSharedSuccessAction(prefs))
    );

  @Effect({dispatch: false}) updateTheme$ = this.actions$
    .ofType(SharedActionTypes.UpdateThemeActionType).pipe(
      tap((action: UpdateThemeAction) => this.sharedServices.updateTheme(action.theme))
    );

  @Effect({dispatch: false}) updateQueries$ = this.actions$
    .ofType(SharedActionTypes.UpdateMostUsedQueriesActionType).pipe(
      tap((action: UpdateMostUsedQueriesAction) => this.sharedServices.updateQueryStats(action.keywords))
    );

  @Effect({dispatch: false}) logout$ = this.actions$
    .ofType(SharedActionTypes.LogoutActionType).pipe(
      tap((action: LogoutAction) => this.loginService.logout())
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

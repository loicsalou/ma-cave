import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {
  LoadSharedSuccessAction,
  SharedActionTypes,
  UpdateMostUsedQueriesAction,
  UpdateThemeAction
} from './shared.actions';
import {SharedPersistenceService} from '../../service/shared-persistence.service';
import {of} from 'rxjs/observable/of';
import {UserPreferences} from '../../model/user-preferences';

@Injectable()
export class SharedEffectsService {

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
      map(() => of(null))
    );

  @Effect() updateQueries$ = this.actions$
    .ofType(SharedActionTypes.UpdateMostUsedQueriesActionType).pipe(
      tap((action:UpdateMostUsedQueriesAction) => this.sharedServices.updateQueryStats(action.keywords)),
      map(() => of(null))
    );

  constructor(private actions$: Actions, private withdrawalsService: BottlePersistenceService,
              private sharedServices: SharedPersistenceService) {
  }

}

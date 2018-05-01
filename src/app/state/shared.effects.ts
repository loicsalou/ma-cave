import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {map, switchMap} from 'rxjs/operators';
import {LoadSharedSuccessAction, SharedActionTypes} from './shared.actions';
import {SharedPersistenceService} from '../../service/shared-persistence.service';
import {SearchCriteria} from '../../model/search-criteria';

@Injectable()
export class SharedEffectsService {

  @Effect() getShared$ = this.actions$
    .ofType(SharedActionTypes.LoadSharedActionType).pipe(
      switchMap(() => {
        return this.sharedServices.getMostUsedQueries();
        //const obs1=this.withdrawalsService.fetchAllWithdrawals();
        //const obs2=this.withdrawalsService.fetchAllWithdrawals();
      }),
      map((queries: SearchCriteria[]) =>
            new LoadSharedSuccessAction(queries))
    );

  constructor(private actions$: Actions, private withdrawalsService: BottlePersistenceService,
              private sharedServices: SharedPersistenceService) {
  }

}

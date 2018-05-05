import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';
import {CellarActionTypes, LoadCellarSuccessAction} from './cellar.actions';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {Locker} from '../../model/locker';

@Injectable()
export class CellarEffectsService {

  @Effect() loadCellar$ = this.actions$
    .ofType(CellarActionTypes.LoadCellarActionType).pipe(
      switchMap(() =>
                  this.cellarService.loadAllLockers()),
      map((lockers: Locker[]) =>
            new LoadCellarSuccessAction(lockers))
    );

  constructor(private actions$: Actions, private cellarService: CellarPersistenceService) {
  }

}

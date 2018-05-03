import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {
  BottlesActionTypes,
  LoadBottlesSuccessAction,
  UpdateBottlesAction,
  UpdateBottleSuccessAction,
  UpdateFilterAction
} from './bottles.actions';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {Bottle} from '../../model/bottle';
import {SharedPersistenceService} from '../../service/shared-persistence.service';
import {of} from 'rxjs/observable/of';

@Injectable()
export class BottlesEffectsService {

  @Effect() getBottles$ = this.actions$
    .ofType(BottlesActionTypes.LoadBottlesActionType).pipe(
      switchMap(() => this.bottlesService.loadAllBottles()),
      map((bottles: Bottle[]) => new LoadBottlesSuccessAction(bottles))
    );

  @Effect() updateBottle$ = this.actions$
    .ofType(BottlesActionTypes.UpdateBottlesActionType).pipe(
      switchMap((action: UpdateBottlesAction) =>
                  this.bottlesService.update(action.bottle)
      ),
      map((bottles: Bottle[]) =>
            new UpdateBottleSuccessAction(bottles))
    );

  @Effect({dispatch: false}) updateFilter$ = this.actions$
    .ofType(BottlesActionTypes.UpdateFilterActionType).pipe(
      tap((action: UpdateFilterAction) =>
            this.sharedServices.updateFilterStats(action.newFilter)
      )
    );

  constructor(private actions$: Actions, private bottlesService: BottlePersistenceService, private sharedServices: SharedPersistenceService) {
  }

}

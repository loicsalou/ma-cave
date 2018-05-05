import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {
  BottlesActionTypes,
  LoadBottlesSuccessAction, RemoveFilterAction,
  UpdateBottlesAction,
  UpdateBottlesSuccessAction,
  UpdateFilterAction, WithdrawBottleAction, WithdrawBottleSuccessAction
} from './bottles.actions';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {Bottle} from '../../model/bottle';
import {SharedPersistenceService} from '../../service/shared-persistence.service';

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
            new UpdateBottlesSuccessAction(bottles))
    );

  @Effect() withdrawBottle$ = this.actions$
    .ofType(BottlesActionTypes.WithdrawBottleActionType).pipe(
      tap((action: WithdrawBottleAction) =>
                  this.bottlesService.withdraw(action.bottle, action.position)
      ),
      map((action: WithdrawBottleAction) =>
            new WithdrawBottleSuccessAction(action.bottle))
    );

  //@Effect({dispatch: false}) updateFilter$ = this.actions$
  //  .ofType(BottlesActionTypes.UpdateFilterActionType).pipe(
  //    tap((action: UpdateFilterAction) =>
  //          this.sharedServices.updateFilterStats(action.newFilter)
  //    )
  //  );

  @Effect({dispatch: false}) removeFilter$ = this.actions$
    .ofType(BottlesActionTypes.RemoveFilterActionType).pipe(
      tap((action: RemoveFilterAction) =>
            this.bottlesService.removeFromQueryStats(action.keywords)
      )
    );

  constructor(private actions$: Actions, private bottlesService: BottlePersistenceService, private sharedServices: SharedPersistenceService) {
  }

}

import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {
  BottlesActionTypes,
  FixBottlesAction,
  LoadBottlesSuccessAction,
  LoadCellarSuccessAction,
  LockerWasUpdatedAction,
  RemoveFilterAction,
  UpdateBottlesAction,
  UpdateBottlesSuccessAction,
  UpdateFilterAction,
  UpdateLockerAction,
  WithdrawBottleAction
} from './bottles.actions';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {flatMap, map, switchMap, tap} from 'rxjs/operators';
import {Bottle} from '../../model/bottle';
import {SharedPersistenceService} from '../../service/shared-persistence.service';
import {Locker} from '../../model/locker';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {BottleFactory} from '../../model/bottle.factory';
import {CreateOrUpdateWithdrawalAction} from './withdrawals.actions';

@Injectable()
export class BottlesEffectsService {

  @Effect() getBottles$ = this.actions$
    .ofType(BottlesActionTypes.LoadBottlesActionType).pipe(
      switchMap(() => this.bottlesService.loadAllBottles()),
      map((bottles: Bottle[]) => {
        const invalidBottles: { bottle: Bottle, unsupportedAttrs: string[] }[] = this.bottleFactory.validate(bottles);
        if (invalidBottles.length === 0) {
          return new LoadBottlesSuccessAction(bottles);
        } else {
          //traiter les erreurs
          return new FixBottlesAction(invalidBottles);
        }
      })
    );

  @Effect() FixBottles$ = this.actions$
    .ofType(BottlesActionTypes.FixBottlesActionType).pipe(
      map((action: FixBottlesAction) => this.bottleFactory.fixBottles(action.bugs)),
      map((bottles: Bottle[]) => new UpdateBottlesAction(bottles))
    );

  @Effect() updateBottle$ = this.actions$
    .ofType(BottlesActionTypes.UpdateBottlesActionType).pipe(
      switchMap((action: UpdateBottlesAction) =>
                  this.bottlesService.update(action.bottle)
      ),
      map((bottles: Bottle[]) =>
            new UpdateBottlesSuccessAction(bottles))
    );

  // retrait: on update l'objet bottle, on crée l'objet withdraw et on déclenche les actions de mises à jour
  @Effect() withdrawBottle$ = this.actions$
    .ofType(BottlesActionTypes.WithdrawBottleActionType).pipe(
      flatMap((action: WithdrawBottleAction) => {
                let withdrawal = this.bottlesService.createWithdrawal(action.bottle);
                let updatedBottle = this.bottlesService.removeBottleFrom(action.bottle, action.position);
                return [
                  new UpdateBottlesAction([ updatedBottle ]),
                  new CreateOrUpdateWithdrawalAction(withdrawal)
                ];
              }
      )
    );

  @Effect({dispatch: false}) updateFilter$ = this.actions$
    .ofType(BottlesActionTypes.UpdateFilterActionType).pipe(
      tap((action: UpdateFilterAction) =>
            this.sharedServices.updateFilterStats(action.newFilter)
      )
    );

  @Effect({dispatch: false}) removeFilter$ = this.actions$
    .ofType(BottlesActionTypes.RemoveFilterActionType).pipe(
      tap((action: RemoveFilterAction) =>
            this.bottlesService.removeFromQueryStats(action.keywords)
      )
    );
  @Effect() loadCellar$ = this.actions$
    .ofType(BottlesActionTypes.LoadCellarActionType).pipe(
      switchMap(() =>
                  this.cellarService.loadAllLockers()),
      map((lockers: Locker[]) =>
            new LoadCellarSuccessAction(lockers))
    );

  @Effect() updateLocker$ = this.actions$
    .ofType(BottlesActionTypes.UpdateLockerActionType).pipe(
      switchMap((action: UpdateLockerAction) => {
        return this.bottlesService.updateLockerAndBottles(action.bottles, action.locker);
      }),
      map((updates: { bottles: Bottle[], locker: Locker }) =>
            new LockerWasUpdatedAction(updates.bottles, updates.locker))
    );

  @Effect() lockerUpdated$ = this.actions$
    .ofType(BottlesActionTypes.LockerWasUpdatedActionType).pipe(
      switchMap(() =>
                  this.cellarService.loadAllLockers()),
      map((lockers: Locker[]) =>
            new LoadCellarSuccessAction(lockers))
    );

  constructor(private actions$: Actions,
              private bottlesService: BottlePersistenceService,
              private cellarService: CellarPersistenceService,
              private sharedServices: SharedPersistenceService,
              private bottleFactory: BottleFactory) {
  }

}

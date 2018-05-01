import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {
  BottlesActionTypes,
  LoadBottlesSuccessAction,
  UpdateBottlesAction,
  UpdateBottleSuccessAction
} from './bottles.action';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {map, switchMap} from 'rxjs/operators';
import {Bottle} from '../../model/bottle';

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

  constructor(private actions$: Actions, private bottlesService: BottlePersistenceService) {
  }

}

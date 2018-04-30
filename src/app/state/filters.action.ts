import {Action} from '@ngrx/store';
import {FilterSet} from '../../components/distribution/filterset';

export enum FiltersActionTypes {
  UpdateFilterActionType = '[filter] - changed',
  ResetFilterActionType = '[filter] - reset'
}

export type FiltersActions = UpdateFilterAction | ResetFilterAction;

export class UpdateFilterAction implements Action {
  readonly type = FiltersActionTypes.UpdateFilterActionType;

  constructor(public newFilter: FilterSet) {
  }
}

export class ResetFilterAction implements Action {
  readonly type = FiltersActionTypes.ResetFilterActionType;
}

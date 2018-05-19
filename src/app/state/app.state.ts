import {contactsReducer, ContactsState} from './contacts/contact.reducer';
import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {storeFreeze} from 'ngrx-store-freeze';
import {bottlesStateReducer, BottlesState} from './bottles.state';
import {withdrawalsStateReducer, WithdrawalsState} from './withdrawals.state';
import {SharedState, sharedStateReducer} from './shared.state';

export interface ApplicationState {
  bottles: BottlesState;
  withdrawals: WithdrawalsState;
  shared: SharedState;
}

export const ROOT_REDUCERS: ActionReducerMap<ApplicationState> = {
  bottles: bottlesStateReducer,
  withdrawals: withdrawalsStateReducer,
  shared: sharedStateReducer
};

export const META_REDUCERS: MetaReducer<any>[] = environment.production
  ? []
  : [ storeFreeze, logReducer ];

export function logReducer(reducer) {
  return (state, action) => {
    //console.log(action.type);
    const newState = reducer(state, action);
    return newState;
  };
}

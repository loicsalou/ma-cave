import {contactsReducer, ContactsState} from './contacts/contact.reducer';
import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {storeFreeze} from 'ngrx-store-freeze';
import {bottlesReducer, BottlesState} from './bottles.state';

export interface ApplicationState {
  bottles: BottlesState;
}

export const ROOT_REDUCERS: ActionReducerMap<ApplicationState> = {
  bottles: bottlesReducer
};

export const META_REDUCERS: MetaReducer<any>[] = environment.production
  ? []
  : [ storeFreeze, logReducer ];

function logReducer(reducer) {
  return (state, action) => {
    console.log(action.type);
    const newState = reducer(state, action);
    return newState;
  };
}

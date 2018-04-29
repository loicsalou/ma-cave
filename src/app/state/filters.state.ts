import {contactsReducer, ContactsState} from './contacts/contact.reducer';
import {environment} from '../../environments/environment';
import {FilterSet} from '../../components/distribution/distribution';
import {FiltersActions, FiltersActionTypes} from './filters.action';

export interface FilterState {
  filters: FilterSet;
}

const INITIAL_STATE: FilterState = {
  filters: new FilterSet()
};

export function filterReducer(state: FilterState = INITIAL_STATE, action: FiltersActions) {
  switch (action.type) {

    case FiltersActionTypes.UpdateFilterActionType: {
      return {
        ...state,
        filters: action.newFilter
      };
    }

    case FiltersActionTypes.ResetFilterActionType: {
      return {
        ...state,
        filters: new FilterSet()
      };
    }

    default:
      return state;
  }
}


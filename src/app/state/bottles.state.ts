import {contactsReducer, ContactsState} from './contacts/contact.reducer';
import {Bottle} from '../../model/bottle';
import {BottlesActions, BottlesActionTypes} from './bottles.action';
import {ApplicationState} from './app.state';
import {FilterSet} from '../../components/distribution/filterset';
import {createSelector} from '@ngrx/store';
import {match} from '../../components/distribution/filter-matcher';

export interface BottlesState {
  allBottles: {
    list: Bottle[],
    loading: boolean;
    loaded: boolean;
  };
  filteredBottles: string[]; // les Ids
}

const INITIAL_STATE: BottlesState = {
  allBottles: {
    list: [],
    loading: false,
    loaded: false
  },
  filteredBottles: []
};

export namespace BottlesQuery {
  export const getFilter = (state: ApplicationState) => state.filters.filters;
  export const getBottles = (state: ApplicationState) => state.bottles.allBottles.list;
  export const getBottlesLoaded = (state: ApplicationState) => state.bottles.allBottles.loaded;
  export const getBottlesLoading = (state: ApplicationState) => state.bottles.allBottles.loading;
  export const getSelectedBottles = createSelector(
    getBottles, getFilter, (bottles: Bottle[], filter: FilterSet) => filter
      ? bottles.filter((bottle: Bottle) => match(filter, bottle))
      : bottles
  );
}

export function bottlesReducer(state: BottlesState = INITIAL_STATE, action: BottlesActions) {
  switch (action.type) {

    case BottlesActionTypes.CreateBottleActionType: {
      return {
        ...state
      };
    }

    case BottlesActionTypes.DrawBottlesActionType: {
      return {
        ...state
      };
    }

    case BottlesActionTypes.LoadBottlesActionType: {
      return {
        ...state,
        allBottles: {
          ...state.allBottles,
          loading: true,
          loaded: false
        }
      };
    }

    case BottlesActionTypes.LoadBottlesFailedActionType: {
      return {
        ...state,
        allBottles: {
          ...state.allBottles,
          loading: false
        }
      };
    }

    case BottlesActionTypes.LoadBottlesSuccessActionType: {
      return {
        ...state,
        allBottles: {
          list: action.bottles,
          loading: false,
          loaded: true
        }
      };
    }

    case BottlesActionTypes.UpdateBottlesActionType: {
      return {
        ...state
      };
    }

    default:
      return state;
  }
}


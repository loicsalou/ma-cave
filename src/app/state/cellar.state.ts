import {ApplicationState} from './app.state';
import {Locker} from '../../model/locker';
import {CellarActions, CellarActionTypes} from './cellar.actions';

export interface CellarState {
  allLockers: {
    list: Locker[],
    loading: boolean;
    loaded: boolean;
  };
}

const INITIAL_STATE: CellarState = {
  allLockers: {
    list: [],
    loading: false,
    loaded: false
  }
};

export namespace CellarQuery {
  export const getLockers = (state: ApplicationState) => state.cellar.allLockers.list;
  export const getLockersLoaded = (state: ApplicationState) => state.cellar.allLockers.loaded;
  export const getLockersLoading = (state: ApplicationState) => state.cellar.allLockers.loading;
}

export function lockersStateReducer(state: CellarState = INITIAL_STATE, action: CellarActions): CellarState {
  switch (action.type) {

    case CellarActionTypes.LoadCellarActionType: {
      return {
        ...state,
        allLockers: {
          ...state.allLockers,
          loaded: false,
          loading: true
        }
      };
    }

    case CellarActionTypes.LoadCellarSuccessActionType: {
      return {
        ...state,
        allLockers: {
          list: action.lockers,
          loaded: true,
          loading: false
        }
      };
    }

    case CellarActionTypes.LoadCellarFailedActionType: {
      return {
        ...state,
        allLockers: {
          ...state.allLockers,
          loading: false,
          loaded: false
        }
      };
    }

    default:
      return state;
  }
}

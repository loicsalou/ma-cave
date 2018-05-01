import {contactsReducer, ContactsState} from './contacts/contact.reducer';
import {Bottle} from '../../model/bottle';
import {BottlesActions, BottlesActionTypes} from './bottles.actions';
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
  filters: FilterSet;
  selected: string[]; // sélectionnées dans la liste
}

const INITIAL_STATE: BottlesState = {
  allBottles: {
    list: [],
    loading: false,
    loaded: false
  },
  filters: new FilterSet(),
  selected: []
};

export namespace BottlesQuery {
  export const getFilter = (state: ApplicationState) => state.bottles.filters;
  export const getBottles = (state: ApplicationState) => state.bottles.allBottles.list;
  export const getBottlesLoaded = (state: ApplicationState) => state.bottles.allBottles.loaded;
  export const getBottlesLoading = (state: ApplicationState) => state.bottles.allBottles.loading;
  export const getBottlesSelectedIds = (state: ApplicationState) => state.bottles.selected;
  export const getFilteredBottles = createSelector(
    getBottles, getFilter, (bottles: Bottle[], filter: FilterSet) => filter
      ? (bottles
        ? bottles.filter((bottle: Bottle) => match(filter, bottle))
        : bottles)
      : bottles
  );
  export const getSelectedBottles = createSelector(
    getBottles, getBottlesSelectedIds, (bottles: Bottle[], selected: string[]) =>
      selected.map((id: string) => bottles.find(btl => btl.id === id))
        .filter(btl => btl != undefined)
  );
}

export function bottlesStateReducer(state: BottlesState = INITIAL_STATE, action: BottlesActions): BottlesState {
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
          ...state.allBottles,
          list: action.bottles,
          loading: false,
          loaded: true
        }
      };
    }

    case BottlesActionTypes.ResetBottleSelectionActionType: {
      return {
        ...state,
        selected: []
      };
    }

    case BottlesActionTypes.ResetFilterActionType: {
      return {
        ...state,
        filters: new FilterSet()
      };
    }

    case BottlesActionTypes.SelectBottleActionType: {
      return {
        ...state,
        selected: selectedBottles(state.selected, action.bottle, action.selected)
      };
    }

    case BottlesActionTypes.UpdateBottlesActionType: {
      return state;
    }

    case BottlesActionTypes.UpdateBottlesSuccessActionType: {
      return {
        ...state,
        allBottles: {
          ...state.allBottles,
          list: updateList(state.allBottles.list, action.bottles)
        }
      };
    }

    case BottlesActionTypes.UpdateFilterActionType: {
      return {
        ...state,
        filters: action.newFilter
      };
    }

    default:
      return state;
  }
}

/**
 * Mise à jour de la liste des bouteilles suite à l'update d'une ou plusieurs bouteilles.
 * @param {Bottle[]} bottles la liste actuelle de bouteilles
 * @param {Bottle[]} updatedBottles la liste des bouteilles mises à jour
 * @returns {Bottle[]} la nouvelle liste
 */
function updateList(bottles: Bottle[], updatedBottles: Bottle[]): Bottle[] {
  const currentBottlesMinusUpdated: Bottle[] = bottles.filter(
    bottle => {
      let ix = updatedBottles.findIndex(updatedBottle => updatedBottle.id === bottle.id);
      return ix === -1;
    });

  return [ ...currentBottlesMinusUpdated, ...updatedBottles ];
}

/**
 * met à jour la liste des bouteilles sélectionnées.
 * @param {string[]} selectedBottles, les IDs des bouteilles sélectionnées
 * @param {Bottle} bottle la bouteille à ajouter ou retirer de la sélection
 * @param {boolean} selected true si on l'ajoute à la sélection, false si on la retire
 * @returns {string[]} la nouvelle liste d'IDs des bouteilles sélectionnées
 */
function selectedBottles(selectedBottles: string[], bottle: Bottle, selected: boolean): string[] {
  if (selected) {
    return [ ...selectedBottles, bottle.id ];
  } else {
    return selectedBottles.filter(id => id != bottle.id);
  }
}

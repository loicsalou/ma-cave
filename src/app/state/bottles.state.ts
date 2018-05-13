import {contactsReducer, ContactsState} from './contacts/contact.reducer';
import {Bottle} from '../../model/bottle';
import {BottlesActions, BottlesActionTypes} from './bottles.actions';
import {ApplicationState} from './app.state';
import {FilterSet} from '../../components/distribution/filterset';
import {createSelector} from '@ngrx/store';
import {match} from '../../components/distribution/filter-matcher';
import {Locker} from '../../model/locker';

export interface BottlesState {
  allBottles: {
    entities: { [ id: string ]: Bottle };
    loading: boolean;
    loaded: boolean;
  };
  allLockers: {
    list: Locker[];
    loading: boolean;
    loaded: boolean;
  };
  edition: {
    locker: Locker;
  },
  filters: FilterSet;
  selected: string[]; // sélectionnées dans la liste
}

const INITIAL_STATE: BottlesState = {
  allBottles: {
    entities: {},
    loading: false,
    loaded: false
  },
  allLockers: {
    list: [],
    loading: false,
    loaded: false
  },
  edition: {
    locker: undefined
  },
  filters: new FilterSet(),
  selected: []
};

export namespace BottlesQuery {
  export const getLockers = (state: ApplicationState) => state.bottles.allLockers.list;
  export const getLockersLoaded = (state: ApplicationState) => state.bottles.allLockers.loaded;
  export const getLockersLoading = (state: ApplicationState) => state.bottles.allLockers.loading;
  export const getEditedLocker = (state: ApplicationState) => state.bottles.edition.locker;
  export const getFilter = (state: ApplicationState) => state.bottles.filters;
  export const getBottleEntities = (state: ApplicationState) => state.bottles.allBottles.entities;
  export const getBottles = (state: ApplicationState) => {
    const entities = state.bottles.allBottles.entities;
    return entitiesToArray(entities);
  };
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
    getBottleEntities, getBottlesSelectedIds, (bottles: { [ id: string ]: Bottle }, selected: string[]) =>
      selected.map((id: string) => bottles[ id ])
        .filter(btl => btl != undefined)
  );
  export const getFilteredBottlesStates = createSelector(
    getFilteredBottles, getSelectedBottles,
    (bottles: Bottle[], selected: Bottle[]) => {
      return bottles.map(
        btl => {
          return {
            bottle: btl,
            selected: selected.findIndex(sel => sel.id == btl.id) !== -1
          };
        }
      );
    }
  );
  export const getEditLockerAndBottles = createSelector(
    getBottles, getEditedLocker, (bottles: Bottle[], locker: Locker) => {
      const editedBottles = bottles.filter(
        bottle => bottle.positions.filter(
          pos => pos.inLocker(locker.id)).length > 0
      );
      return {locker: locker, bottles: editedBottles};
    }
  );
}

export function bottlesStateReducer(state: BottlesState = INITIAL_STATE, action: BottlesActions): BottlesState {
  switch (action.type) {

    case BottlesActionTypes.CreateBottleActionType: {
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
      const entities = toEntitiesById(action.bottles);
      return {
        ...state,
        allBottles: {
          ...state.allBottles,
          entities: entities,
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

    case BottlesActionTypes.SetSelectedBottleActionType: {
      return {
        ...state,
        selected: selectedBottles(state.selected, action.bottle, action.selected)
      };
    }

    case BottlesActionTypes.UnselectBottlesActionType: {
      return {
        ...state,
        selected: []
      };
    }

    case BottlesActionTypes.UpdateBottlesActionType: {
      return state;
    }

    case BottlesActionTypes.WithdrawBottleSuccessActionType: {
      return {
        ...state,
        allBottles: {
          ...state.allBottles,
          entities: updateBottles(state.allBottles.entities, [ action.bottle ])
        }
      };
    }

    case BottlesActionTypes.UpdateBottlesSuccessActionType: {
      return {
        ...state,
        allBottles: {
          ...state.allBottles,
          entities: updateBottles(state.allBottles.entities, action.bottles)
        }
      };
    }

    case BottlesActionTypes.LoadCellarSuccessActionType: {
      return {
        ...state,
        allLockers: {
          ...state.allLockers,
          list: action.lockers,
          loaded: true,
          loading: false
        }
      };
    }

    case BottlesActionTypes.EditLockerActionType: {
      return {
        ...state,
        edition: {
          ...state.edition,
          locker: action.locker
        }
      };
    }

    case BottlesActionTypes.LockerWasUpdatedActionType: {
      return {
        ...state,
        allBottles: {
          ...state.allBottles,
          entities: updateBottles(state.allBottles.entities, action.bottles)
        },
        allLockers: {
          ...state.allLockers,
          list: updateLockers(state.allLockers.list, [ action.locker ])
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

// renvoie les entités indexées par ID sous forme de tableau d'entité
function toEntitiesById(bottles: any[]): { [ id: string ]: Bottle } {
  return bottles.reduce(
    (bottlesById: { [ id: string ]: any }, bottle: any) => {
      return {
        ...bottlesById,
        [ bottle.id ]: bottle
      };
    }, {}
  );
}

// renvoie les entités indexées par ID sous forme de tableau d'entité
function entitiesToArray(entities: { [ id: string ]: any }): any[] {
  return Object.keys(entities).map(id => entities[ id ]);
}

/**
 * Mise à jour de la liste des bouteilles suite à l'update d'une ou plusieurs bouteilles.
 * @param {Bottle[]} bottles la liste actuelle de bouteilles
 * @param {Bottle[]} updatedBottles la liste des bouteilles mises à jour
 * @returns {Bottle[]} la nouvelle liste
 */
function updateBottles(bottles: { [ id: string ]: Bottle }, updatedBottles: Bottle[]): { [ id: string ]: Bottle } {
  return {...bottles, ...toEntitiesById(updatedBottles)};
}

/**
 * Mise à jour de la liste des lockers suite à l'update d'un ou plusieurs d'entre eux.
 * @param {Locker[]} lockers la liste actuelle de lockers
 * @param {Locker[]} updatedLockers la liste des lockers mis à jour
 * @returns {Locker[]} la nouvelle liste de lockers
 */
function updateLockers(lockers: Locker[], updatedLockers: Locker[]): Locker[] {
  const currentLockersMinusUpdated: Locker[] = lockers.filter(
    locker => {
      let ix = updatedLockers.findIndex(updatedLocker => updatedLocker.id === locker.id);
      return ix === -1;
    });

  return [ ...currentLockersMinusUpdated, ...updatedLockers ];
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

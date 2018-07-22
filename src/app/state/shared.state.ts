import {contactsReducer, ContactsState} from './contacts/contact.reducer';
import {ApplicationState} from './app.state';
import {User} from '../../model/user';
import {SearchCriteria} from '../../model/search-criteria';
import {SharedActions, SharedActionTypes} from './shared.actions';

export enum BOTTLE_ITEM_TYPE {
  STANDARD = 'standard',
  LARGE = 'large'
};

export interface SharedState {
  mostUsedQueries: SearchCriteria[];
  theme: string;
  bottleItemType: BOTTLE_ITEM_TYPE,
  user: User;
}

const INITIAL_STATE: SharedState = {
  mostUsedQueries: [],
  theme: 'default',
  bottleItemType: BOTTLE_ITEM_TYPE.STANDARD,
  user: undefined,
};

export namespace SharedQuery {
  export const getSharedState = (state: ApplicationState) => state.shared;
  export const getLoginUser = (state: ApplicationState) => state.shared.user;
}

export function sharedStateReducer(state: SharedState = INITIAL_STATE, action: SharedActions): SharedState {
  switch (action.type) {
    case SharedActionTypes.LoadSharedSuccessActionType: {
      if (action.prefs) {
        return {
          ...state,
          mostUsedQueries: action.prefs.mostUsedQueries,
          bottleItemType: action.prefs.itemType,
          theme: action.prefs.theme
        };
      } else {
        return state;
      }
    }

    case SharedActionTypes.LoginActionSuccessType: {
      return {
        ...state,
        user: action.user
      };
    }

    case SharedActionTypes.LogoutActionType: {
      return INITIAL_STATE;
    }

    case SharedActionTypes.UpdatePrefsActionType: {
      return {
        ...state,
        theme: action.theme,
        bottleItemType: action.itemType
      };
    }

    default:
      return state;
  }
}

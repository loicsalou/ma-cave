import {contactsReducer, ContactsState} from './contacts/contact.reducer';
import {ApplicationState} from './app.state';
import {User} from '../../model/user';
import {SearchCriteria} from '../../model/search-criteria';
import {SharedActions, SharedActionTypes} from './shared.actions';

export interface SharedState {
  mostUsedQueries: SearchCriteria[];
  theme: string;
  user: User;
}

const INITIAL_STATE: SharedState = {
  mostUsedQueries: [],
  theme: 'default',
  user: undefined
};

export namespace SharedQuery {
  export const getSharedState = (state: ApplicationState) => state.shared;
}

export function sharedStateReducer(state: SharedState = INITIAL_STATE, action: SharedActions): SharedState {
  switch (action.type) {
    case SharedActionTypes.LoadSharedSuccessActionType:
      return {
        ...state,
        mostUsedQueries: action.queries
      }

    default:
      return state;
  }
}

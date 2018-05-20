import {contactsReducer, ContactsState} from './contacts/contact.reducer';
import {ApplicationState} from './app.state';
import {Withdrawal} from '../../model/withdrawal';
import {WithdrawalsActions, WithdrawalsActionTypes} from './withdrawals.actions';
import {createSelector} from '@ngrx/store';
import {Bottle} from '../../model/bottle';
import {LogoutAction, SharedActionTypes} from './shared.actions';

export interface WithdrawalsState {
  withdrawals: { [ key: string ]: Withdrawal };
  loading: boolean;
  loaded: boolean;
}

const INITIAL_STATE: WithdrawalsState = {
  withdrawals: {},
  loading: false,
  loaded: false
};

export namespace WithdrawalsQuery {
  export const getWithdrawalsState = (state: ApplicationState) => state.withdrawals;
  export const getWithdrawals = createSelector(getWithdrawalsState, (state: WithdrawalsState) =>
      Object.keys(state.withdrawals).map(id => state.withdrawals[ id ])
    )
  ;
}

export function withdrawalsStateReducer(state: WithdrawalsState = INITIAL_STATE, action: WithdrawalsActions | LogoutAction): WithdrawalsState {
  switch (action.type) {

    case WithdrawalsActionTypes.LoadWithdrawalsActionType: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case WithdrawalsActionTypes.LoadWithdrawalsFailedActionType: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case WithdrawalsActionTypes.LoadWithdrawalsSuccessActionType: {
      return {
        ...state,
        withdrawals: toEntitiesById(action.withdrawals),
        loading: false,
        loaded: true
      };
    }

    case WithdrawalsActionTypes.CreateOrUpdateWithdrawalSuccessActionType: {
      return {
        ...state,
        withdrawals: updateWithdrawals(state.withdrawals, action.withdrawal)
      };
    }

    case SharedActionTypes.LogoutActionType: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}

function toEntitiesById(withdrawals: Withdrawal[]): { [ id: string ]: Withdrawal } {
  return withdrawals.reduce(
    (entities: { [ id: string ]: Withdrawal }, withdrawal: Withdrawal) => {
      return {
        ...entities,
        [ withdrawal.id ]: withdrawal
      };
    },
    {}
  );
}

/**
 * Mise à jour de la liste des bouteilles suite à l'update d'une ou plusieurs bouteilles.
 * @param {Bottle[]} bottles la liste actuelle de bouteilles
 * @param {Bottle[]} updatedBottles la liste des bouteilles mises à jour
 * @returns {Bottle[]} la nouvelle liste
 */
function updateWithdrawals(withdrawals: { [ id: string ]: Withdrawal }, updatedWithdrawal: Withdrawal): { [ id: string ]: Withdrawal } {
  return {...withdrawals, ...toEntitiesById([ updatedWithdrawal ])};
}

import {contactsReducer, ContactsState} from './contacts/contact.reducer';
import {ApplicationState} from './app.state';
import {Withdrawal} from '../../model/withdrawal';
import {WithdrawalsActions, WithdrawalsActionTypes} from './withdrawals.actions';
import {createSelector} from '@ngrx/store';

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

export function withdrawalsStateReducer(state: WithdrawalsState = INITIAL_STATE, action: WithdrawalsActions): WithdrawalsState {
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
        withdrawals: toEntities(action.withdrawals),
        loading: false,
        loaded: true
      };
    }

    // TODO mettre à jour le state une fois que le retrait est confirmé
    case WithdrawalsActionTypes.CreateOrUpdateWithdrawalSuccessActionType: {
      return {
        ...state
      };
    }

    default:
      return state;
  }
}

function toEntities(withdrawals: Withdrawal[]): { [ id: string ]: Withdrawal } {
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

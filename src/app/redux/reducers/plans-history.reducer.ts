import { createReducer, on, Action } from '@ngrx/store';


import { PlansHistoryState, plansHistoryStateAdapter } from '@redux/states/plans-history.state';

import { addPlans } from '@redux/actions/plan.actions';

export const initialState: PlansHistoryState = plansHistoryStateAdapter.getInitialState();

export const iplansHistoryReducer = createReducer(
    initialState,
    on(addPlans, (state, { plans }) => plansHistoryStateAdapter.addMany(plans, state))
);

export const plansHistoryReducer = (state: PlansHistoryState | undefined, action: Action) => iplansHistoryReducer(state, action);


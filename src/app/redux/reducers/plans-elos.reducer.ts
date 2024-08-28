import { createReducer, on, Action } from '@ngrx/store';


import { PlansElosState, planElosStateAdapter } from '@redux/states/plans-elos.state';

import { addOnePlanElo, updatePlanElos } from '@redux/actions/plans-elos.actions';

export const initialState: PlansElosState = planElosStateAdapter.getInitialState();

export const iplansElosReducer = createReducer(
    initialState,
    on(addOnePlanElo, (state, { planElo }) => planElosStateAdapter.addOne(planElo, state)),

    on(updatePlanElos, (state, { planElo }) => planElosStateAdapter.updateOne(planElo, state))
);

export const plansElosReducer = (state: PlansElosState | undefined, action: Action) => iplansElosReducer(state, action);

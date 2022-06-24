import { createReducer, on, Action } from '@ngrx/store';


import { MovesState, movesAdapter } from '@redux/states/moves.state';

import { addMove, addMoves, deleteMove } from '@redux/actions/moves.actions';

export const initialState: MovesState = movesAdapter.getInitialState();

export const imovesReducer = createReducer(
    initialState,
    on(addMoves, (state, { moves }) => {
        return movesAdapter.addMany(moves, state);
    }),

    on(addMove, (state, { move }) => {
        return movesAdapter.addOne(move, state);
    }),

    on(deleteMove, (state, { move }) => {
        return movesAdapter.removeOne(move.uid, state);
    })
);

export function movesReducer(state: MovesState | undefined, action: Action) {
    return imovesReducer(state, action);
}
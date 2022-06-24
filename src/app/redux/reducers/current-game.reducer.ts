import { createReducer, on, Action } from '@ngrx/store';

import { CurrentGameState, StatusCurrentGame } from '@redux/states/current-game.state';
import { clearCurrentGame, setCurrentGame, setErrorCurrentGame, setStatusCurrentGame, cancelCurrentGame } from '@redux/actions/current-game.actions';

export const initialState: CurrentGameState = {
    game: null,
    status: StatusCurrentGame.creating,
    error: null
};

export const icurrentGameReducer = createReducer(
    initialState,
    on(clearCurrentGame, (state,) => {
        return {
            ...state,
            game: null
        };
    }),

    on(setCurrentGame, (state, { game }) => {
        return {
            ...state,
            game
        };
    }),

    on(setErrorCurrentGame, (state, { error }) => {
        return {
            ...state,
            error
        };
    }),

    on(setStatusCurrentGame, (state, { status }) => {
        return {
            ...state,
            status
        };
    }),

    on(cancelCurrentGame, (state, { cancelReason }) => {
        return {
            ...state,
            game: {
                ...state.game,
                status: 'finished',
                result: '*',
                cancelReason
            },
            status: StatusCurrentGame.finished
        };
    })
);

export function currentGameReducer(state: CurrentGameState | undefined, action: Action) {
    return icurrentGameReducer(state, action);
}

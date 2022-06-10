import { createSelector } from '@ngrx/store';


import { getCurrentGameState} from '@redux/reducers/app.reducers';


export const getCurrentGame = createSelector(
    getCurrentGameState,
    getCurrentGameState => getCurrentGameState.game
);

export const getCurrentGameStatus = createSelector(
    getCurrentGameState,
    getCurrentGameState => getCurrentGameState.status
);

export const getCurrentGameError = createSelector(
    getCurrentGameState,
    getCurrentGameState => getCurrentGameState.error
);
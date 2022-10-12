import { createSelector } from '@ngrx/store';

import { getMovesState, movesAdapter } from '@redux/states/moves.state';

export const {
    selectAll: getAllMoves,
    selectTotal: getCountAllMoves,
    selectEntities: getMovesEntities
} = movesAdapter.getSelectors(getMovesState);


export const getMovesByGame = (uidGame) => createSelector(
    getAllMoves,
    (moves) => {
        const movesFiltered = moves;
        return movesFiltered.filter(move => move.uidGame === uidGame);
    }
);

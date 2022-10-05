import { createSelector } from '@ngrx/store';

import { getPuzzlesState, puzzlesAdapter } from '@redux/states/puzzles.state';

export const {
    selectAll: getAllPuzzles,
    selectTotal: getCountAllPuzzles,
    selectEntities: getPuzzlesEntities
} = puzzlesAdapter.getSelectors(getPuzzlesState);



import { createSelector } from '@ngrx/store';

import { getCoordinatesPuzzlesState, coordinatesPuzzlesStateAdapter } from '@redux/states/coordinates-puzzles.state';

export const {
    selectAll: getAllCoordinatesPuzzles,
    selectTotal: getCountAllCoordinatesPuzzles,
    selectEntities: getCoordinatesPuzzlesEntities
} = coordinatesPuzzlesStateAdapter.getSelectors(getCoordinatesPuzzlesState);


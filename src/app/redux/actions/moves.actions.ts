import { createAction, props } from '@ngrx/store';

import { Move } from '@models/game.model';

export const addMoves = createAction(
    '[Moves] addMoves',
    props<{ moves: Move[] }>()
);

export const addMove = createAction(
    '[Moves] addMove',
    props<{ move: Move }>()
);

export const deleteMove = createAction(
    '[Moves] deleteMove',
    props<{ move: Move }>()
);
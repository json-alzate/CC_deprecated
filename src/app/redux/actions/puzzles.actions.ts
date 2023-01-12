import { createAction, props } from '@ngrx/store';

import { Puzzle } from '@models/puzzle.model';


export const requestLoadPuzzles = createAction(
    '[Puzzles] requestLoadPuzzles',
    props<{ eloStar: number; eloEnd: number }>()
);

export const requestLoadPuzzlesInfinite = createAction(
    '[Puzzles] requestLoadPuzzlesInfinite',
    props<{ eloStar: number; eloEnd: number; phases: string[] }>()
);

export const addPuzzles = createAction(
    '[Puzzles] addPuzzles',
    props<{ puzzles: Puzzle[] }>()
);

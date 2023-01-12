import { createFeatureSelector } from '@ngrx/store';

import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Puzzle } from '@models/puzzle.model';


export type InfinitePuzzlesState = EntityState<Puzzle>;

export const infinitePuzzleAdapter: EntityAdapter<Puzzle> = createEntityAdapter<Puzzle>({
    selectId: (infinitePuzzle) => infinitePuzzle.uid
});


export const getInfinitePuzzlesState = createFeatureSelector<InfinitePuzzlesState>('infinitePuzzles');


import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

/** Models **/
import { Move } from '@models/game.model';

export type MovesState = EntityState<Move>;

export const movesAdapter: EntityAdapter<Move> = createEntityAdapter<Move>({
    selectId: (move) => move.uid
});

export const getMovesState = createFeatureSelector<MovesState>('moves');

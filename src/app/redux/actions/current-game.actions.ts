import { createAction, props } from '@ngrx/store';

import { Game } from '@models/game.model';

export const setStatusCurrentGame = createAction(
    '[Current-Game] setStatusCurrentGame',
    props<{ status: 'loading' | 'playing' | 'error' | null }>()
);

export const setCurrentGame = createAction(
    '[Current-Game] setCurrentGame',
    props<{ game: Game }>()
);


export const setErrorCurrentGame = createAction(
    '[Current-Game] setErrorCurrentGame',
    props<{ error: string }>()
);

export const clearCurrentGame = createAction(
    '[Current-Game] clearCurrentGame'
);
import { createAction, props } from '@ngrx/store';

import { StatusCurrentGame } from '@redux/states/current-game.state';
import { Game } from '@models/game.model';

export const setStatusCurrentGame = createAction(
    '[Current-Game] setStatusCurrentGame',
    props<{ status: StatusCurrentGame }>()
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

export const cancelCurrentGame = createAction(
    '[Current-Game] cancelCurrentGame',
    props<{ cancelReason: string }>()
);

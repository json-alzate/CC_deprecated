import { createAction, props } from '@ngrx/store';

import { CoordinatesGame } from '@models/coordinates.model';

export const addCoordinatesGame = createAction(
    '[Coordinates] addCoordinatesGame',
    props<{ gameCoordinates: CoordinatesGame }>()
);

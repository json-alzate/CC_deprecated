import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { from, merge } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { addCoordinatesGame } from '@redux/actions/coordinates.actions';

import { CoordinatesPuzzlesService } from '@services/coordinates-puzzles.service';

@Injectable()
export class CoordinatesEffects {

    addNewNickName$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCoordinatesGame),
            mergeMap((data) =>
                from(this.coordinatesPuzzlesService.addGameCoordinates(data.gameCoordinates)).pipe(
                    mergeMap(() => []),
                    catchError(() => merge([
                    ]))
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private coordinatesPuzzlesService: CoordinatesPuzzlesService
    ) { }

}

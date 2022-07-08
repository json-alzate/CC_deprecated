import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { from, merge } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { addCoordinatesPuzzles, requestGetCoordinatesPuzzles } from '@redux/actions/coordinates-puzzles.actions';

import { CoordinatesPuzzlesService } from '@services/coordinates-puzzles.service';

@Injectable()
export class CoordinatesEffects {

    requestGetCoordinatesPuzzles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestGetCoordinatesPuzzles),
            mergeMap((data) =>
                from(this.coordinatesPuzzlesService.getCoordinatesPuzzles(data.uidUser)).pipe(
                    mergeMap((coordinatesPuzzles) => [
                        addCoordinatesPuzzles({ coordinatesPuzzles })
                    ]),
                    catchError(() => merge([]))
                )
            )
        )
    );



    constructor(
        private actions$: Actions,
        private coordinatesPuzzlesService: CoordinatesPuzzlesService
    ) { }

}

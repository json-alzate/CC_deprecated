import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { from, merge } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';

import {
    addCoordinatesPuzzles,
    requestGetCoordinatesPuzzles,
    requestAddOneCoordinatesPuzzle,
    addOneCoordinatesPuzzle
} from '@redux/actions/coordinates-puzzles.actions';

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

    requestAddOneCoordinatesPuzzle$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestAddOneCoordinatesPuzzle),
            mergeMap((data) =>
                from(this.coordinatesPuzzlesService.addCoordinatesPuzzle(data.coordinatesPuzzle)).pipe(

                    map(docId => addOneCoordinatesPuzzle({ coordinatesPuzzle: { ...data.coordinatesPuzzle, uid: docId } }))

                )
            )
        )
    );





    constructor(
        private actions$: Actions,
        private coordinatesPuzzlesService: CoordinatesPuzzlesService
    ) { }

}

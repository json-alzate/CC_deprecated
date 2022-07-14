import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { from, merge } from 'rxjs';
import { catchError, mergeMap, map, switchMap } from 'rxjs/operators';

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
            switchMap(({ uidUser }) =>
                this.coordinatesPuzzlesService.getCoordinatesPuzzles(uidUser).pipe(
                    mergeMap((coordinatesPuzzles) => [
                        addCoordinatesPuzzles({ coordinatesPuzzles })

                    ])
                ))
        )
    );

    requestAddOneCoordinatesPuzzle$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestAddOneCoordinatesPuzzle),

            switchMap((data) =>

                this.coordinatesPuzzlesService.addCoordinatesPuzzle(data.coordinatesPuzzle).pipe(
                    mergeMap((docId) => [
                        addOneCoordinatesPuzzle({ coordinatesPuzzle: { ...data.coordinatesPuzzle, uid: docId } })

                    ])
                )
            )
        )
    );





    constructor(
        private actions$: Actions,
        private coordinatesPuzzlesService: CoordinatesPuzzlesService
    ) { }

}

import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { from, merge } from 'rxjs';
import { catchError, mergeMap, map, switchMap } from 'rxjs/operators';

import { requestLoadPuzzles, addPuzzles } from '@redux/actions/puzzles.actions';


import { PuzzlesService } from '@services/puzzles.service';

@Injectable()
export class PuzzlesEffects {

    requestLoadPuzzles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestLoadPuzzles),
            switchMap(({ eloStar, eloEnd }) =>
                from(this.puzzlesService.getPuzzles(eloStar, eloEnd)).pipe(
                    mergeMap((puzzles) => [
                        addPuzzles({ puzzles })
                    ])
                ))
        )
    );



    constructor(
        private actions$: Actions,
        private puzzlesService: PuzzlesService
    ) { }

}

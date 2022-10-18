import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { from, merge } from 'rxjs';
import { catchError, mergeMap, map, switchMap } from 'rxjs/operators';

import {
    requestLoadUserPuzzles,
    addUserPuzzles,
    requestAddOneUserPuzzle,
    addOneUserPuzzle
} from '@redux/actions/user-puzzles.actions';


import { UserPuzzlesService } from '@services/user-puzzles.service';

@Injectable()
export class UserPuzzlesEffects {

    requestLoadUserPuzzles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestLoadUserPuzzles),
            switchMap(({ uidUser }) =>
                from(this.userPuzzlesService.getUserPuzzles(uidUser)).pipe(
                    mergeMap((userPuzzles) => [
                        addUserPuzzles({ userPuzzles })
                    ])
                ))
        )
    );


    requestAddOneUserPuzzle$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestAddOneUserPuzzle),
            switchMap(({ userPuzzle }) =>
                from(this.userPuzzlesService.addOneUserPuzzle(userPuzzle)).pipe(
                    mergeMap((docId) => [
                        addOneUserPuzzle({ userPuzzle: { ...userPuzzle, uid: docId } })
                    ])
                ))
        )
    );



    constructor(
        private actions$: Actions,
        private userPuzzlesService: UserPuzzlesService
    ) { }

}

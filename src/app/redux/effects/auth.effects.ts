import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { from, merge } from 'rxjs';
import { switchMap, catchError, mergeMap } from 'rxjs/operators';

import {
    requestLoginGoogle,
    logOut,
    requestSingUpEmail,
    requestLoginEmail,
    setErrorLogin
} from '@redux/actions/auth.actions';


import { AuthService } from '@services/auth.service';

@Injectable()
export class AuthEffects {


    requestLoginGoogle$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestLoginGoogle),
            mergeMap(() =>
                from(this.authService.loginGoogle()).pipe(
                    mergeMap(() => []),
                    catchError(() => merge([
                        setErrorLogin({ error: 'LoginError' })
                    ]))
                )
            )
        )
    );


    requestSingUpEmail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestSingUpEmail),
            mergeMap((data) =>
                from(this.authService.createUserWithEmailAndPassword(data.email, data.password)).pipe(
                    mergeMap(() => [])
                )
            )
        )
    );


    requestLoginEmail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestLoginEmail),
            mergeMap((data) =>
                from(this.authService.signInWithEmailAndPassword(data.email, data.password)).pipe(
                    mergeMap(() => []),
                    catchError(() => merge([
                        setErrorLogin({ error: 'LoginError' })
                    ]))
                )
            )
        )
    );


    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logOut),
            switchMap(() =>
                this.authService.logout().pipe(
                    mergeMap(() => [])
                )
            )
        )

    );

    constructor(
        private actions$: Actions,
        private authService: AuthService
    ) { }

}

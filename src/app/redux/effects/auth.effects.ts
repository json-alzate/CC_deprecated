import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { merge } from 'rxjs';
import { switchMap, catchError, mergeMap, tap, take } from 'rxjs/operators';

import { requestLoginGoogle, logOut } from '@redux/actions/auth.actions';
import { addMessageToast, clearMessageToast } from '@redux/actions/ui.actions';


import { AuthService } from '@services/auth.service';

@Injectable()
export class AuthEffects {


    requestLoginGoogle$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestLoginGoogle),
            tap(() => {
                this.authService.loginGoogle();
            }),
            take(1)
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

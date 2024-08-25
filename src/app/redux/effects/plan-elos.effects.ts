import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { from } from 'rxjs';
import { mergeMap, switchMap, catchError } from 'rxjs/operators';

import {
    requestAddOnePlanElo, addOnePlanElo, requestLoadPlanElos, updatePlanElos, requestUpdatePlanElos
} from '@redux/actions/plans-elos.actions';

import { PlansElosService } from '@services/plans-elos.service';

@Injectable()
export class PlaneElosEffects {


    requestLoadPlanElos$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestLoadPlanElos),
            switchMap(({ uidPlan, uidUser }) =>
                from(this.planElosService.requestGetPlanElos(uidPlan, uidUser)).pipe(
                    mergeMap((planElo) => [addOnePlanElo({ planElo })]),
                    catchError((error) => {
                        console.error('Error getting planElos', error);
                        return [];
                    })
                ))
        )
    );


    requestAddOnePlanElo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestAddOnePlanElo),
            switchMap(({ planElo }) =>
                from(this.planElosService.savePlanElo(planElo)).pipe(
                    mergeMap(() => []),
                    catchError((error) => {
                        console.error('Error saving planElos', error);
                        return [];
                    })
                ))
        )
    );


    requestUpdatePlanElos$ = createEffect(() =>
        this.actions$.pipe(
            ofType(requestUpdatePlanElos),
            switchMap(({ planElo }) =>
                from(this.planElosService.updatePlanElo(planElo)).pipe(
                    mergeMap(() => []),
                    catchError((error) => {
                        console.error('Error updating planElos', error);
                        return [];
                    })
                ))
        )
    );


    constructor(
        private actions$: Actions,
        private planElosService: PlansElosService
    ) { }

}

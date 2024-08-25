import { createAction, props } from '@ngrx/store';

import { PlanElos } from '@models/planElos.model';


export const requestLoadPlanElos = createAction(
    '[PlanElos] requestPlanElos',
    props<{ uidPlan: string; uidUser: string }>()
);

export const requestAddOnePlanElo = createAction(
    '[PlanElos] requestAddOnePlanElo',
    props<{ planElo: PlanElos }>()
);

export const addOnePlanElo = createAction(
    '[PlanElos] addOnePlanElo',
    props<{ planElo: PlanElos }>()
);

export const requestUpdatePlanElos = createAction(
    '[PlanElos] requestUpdatePlanElos',
    props<{ planElo: PlanElos }>()
);

export const updatePlanElos = createAction(
    '[PlanElos] updatePlanElos',
    props<{ planElo: PlanElos }>()
);

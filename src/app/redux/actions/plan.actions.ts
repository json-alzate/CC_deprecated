import { createAction, props } from '@ngrx/store';

import { Plan } from '@models/plan.model';


export const setPlan = createAction(
    '[PLAN] setPlan',
    props<{ plan: Plan }>()
);

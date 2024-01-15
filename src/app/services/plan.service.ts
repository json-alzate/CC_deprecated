import { Injectable } from '@angular/core';
import { Plan, Block } from '@models/plan.model';

import { createUid } from '@utils/create-uid';

// State
import { AppState, getPlanState } from '@redux/states/app.state';

// Store
import { Store } from '@ngrx/store';

// Actions
import { setPlan } from '@redux/actions/plan.actions';

// Selectors
import { getPlan } from '@redux/selectors/plan.selectors';


@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(
    private store: Store<Store>,
  ) { }

  /**
   *
   * @param blocks
   * @param time in seconds (-1 for infinite)
   * */
  newPlan(blocks: Block[], time = -1): Promise<Plan> {

    return new Promise((resolve, reject) => {

      const plan: Plan = {
        uid: createUid(),
        time: time > 0 ? time : -1,
        blocks
      };

      this.store.dispatch(setPlan({ plan }));

      resolve(plan);

    });
  }

  /**
   * Get the current plan
   * */
  getPlan(): Promise<Plan> {

    return new Promise((resolve, reject) => {

      this.store.select(getPlan).subscribe((plan: Plan) => {
        resolve(plan);
      });

    });

  }
}

import { Injectable } from '@angular/core';
import { Plan, Block, PlanTypes } from '@models/plan.model';

import { createUid } from '@utils/create-uid';

// State
import { AppState, getPlanState } from '@redux/states/app.state';

// Store
import { Store } from '@ngrx/store';

// Actions
import { setPlan, requestSavePlan } from '@redux/actions/plan.actions';

// Selectors
import { getPlan } from '@redux/selectors/plan.selectors';

// services
import { FirestoreService } from '@services/firestore.service';


@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(
    private store: Store<Store>,
    private firestoreService: FirestoreService
  ) { }


  /**
   * Actions
   */
  requestSavePlanAction(plan: Plan) {

    // clear puzzles in blocks
    plan.blocks = plan.blocks.map((block: Block) => {
      block.puzzles = [];
      return block;
    });
    this.store.dispatch(requestSavePlan({ plan }));
  }


  /**
   *
   * @param blocks
   * @param time in seconds (-1 for infinite)
   * */
  newPlan(blocks: Block[], planType: PlanTypes, time = -1): Promise<Plan> {

    return new Promise((resolve, reject) => {

      const plan: Plan = {
        uid: createUid(),
        blocks,
        planType,
        createdAt: new Date().getTime(),
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


  /**
   * Save the plan
   */
  savePlan(plan: Plan): Promise<string> {
    return this.firestoreService.savePlan(plan);
  }
}

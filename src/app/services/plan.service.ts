import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { Plan, Block, PlanTypes } from '@models/plan.model';

import { createUid } from '@utils/create-uid';

// State
import { AppState, getPlanState } from '@redux/states/app.state';

// Store
import { Store } from '@ngrx/store';

// Actions
import { setPlan, requestSavePlan, requestGetPlans } from '@redux/actions/plans.actions';

// Selectors
import { getPlan } from '@redux/selectors/plan.selectors';
import { getAllPlansHistory } from '@redux/selectors/plans-history.selectors';

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

  setPlanAction(plan: Plan) {
    this.store.dispatch(setPlan({ plan }));
  }

  requestSavePlanAction(plan: Plan) {
    // clear puzzles in blocks
    plan = {
      ...plan,
      blocks: plan.blocks.map((block: Block) => ({
        ...block,
        puzzles: []
      }))
    };
    this.store.dispatch(requestSavePlan({ plan }));
  }


  requestGetPlansAction(uidUser: string) {
    this.store.dispatch(requestGetPlans({ uidUser }));
  }

  getPlans(uidUser: string): Promise<Plan[]> {
    return this.firestoreService.getPlans(uidUser);
  }

  /** END ACTIONS */

  /** STATE OBSERVABLES */

  getPlansHistoryState(): Observable<Plan[]> {
    return this.store.select(getAllPlansHistory);
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
      this.setPlanAction(plan);
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
  savePlan(plan: Plan) {
    return this.firestoreService.savePlan(plan);
  }
}

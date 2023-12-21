import { Injectable } from '@angular/core';
import { Plan, Block } from '@models/plan.model';

import { createUid } from '@utils/create-uid';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor() { }

  /**
   *
   * @param blocks
   * @param time in seconds (-1 for infinite)
   * */
  newPlan(blocks: Block[], time = -1): Promise<Plan> {

    return new Promise((resolve, reject) => {

      const plan: Plan = {
        uid: createUid(),
        time,
        blocks
      };

      resolve(plan);

    });
  }
}

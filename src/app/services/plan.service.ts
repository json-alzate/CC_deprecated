import { Injectable } from '@angular/core';
import { Plan, Block } from '@models/plan.model';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor() { }

  newPlan(blocks: Block[]): Promise<Plan> {

    return new Promise((resolve, reject) => {

      const plan: Plan = {
        uid: '123456',
        time: 60,
        blocks
      };

      resolve(plan);

    });
  }
}

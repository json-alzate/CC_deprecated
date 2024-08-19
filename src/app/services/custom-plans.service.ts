import { Injectable } from '@angular/core';

import { Plan } from '@models/plan.model';

import { FirestoreService } from '@services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CustomPlansService {

  constructor(
    private firestoreService: FirestoreService
  ) { }

  saveCustomPlan(plan: Plan) {
    this.firestoreService.saveCustomPlan(plan);
  }
}

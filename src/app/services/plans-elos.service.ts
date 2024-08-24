import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { PlanElos } from '@models/planElos.model';

import { createUid } from '@utils/create-uid';

// State
import { PlansElosState } from '@redux/states/plans-elos.state';

// Store
import { Store } from '@ngrx/store';

// Actions
import { requestAddOnePlanElo, addOnePlanElo, requestLoadPlanElos, updatePlanElos } from '@redux/actions/plans-elos.actions';

// Selectors


// services
import { FirestoreService } from '@services/firestore.service';


@Injectable({
  providedIn: 'root'
})
export class PlansElosService {

  constructor(

    private store: Store<PlansElosState>,
    private firestoreService: FirestoreService
  ) { }

  requestGetPlanElos(uidPlan: string) {

  }
}

import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';


import { PlanElos } from '@models/planElos.model';



// State
import { PlansElosState } from '@redux/states/plans-elos.state';

// Store
import { Store } from '@ngrx/store';

// Actions
import {
  requestAddOnePlanElo,
  addOnePlanElo,
  requestLoadPlanElos,
  requestUpdatePlanElos,
  updatePlanElos
} from '@redux/actions/plans-elos.actions';

// Selectors
import { getPlanElo } from '@redux/selectors/plans-elos.selectors';


// services
import { FirestoreService } from '@services/firestore.service';

// utils
import { calculateElo } from '@utils/calculate-elo';


@Injectable({
  providedIn: 'root'
})
export class PlansElosService {

  constructor(
    private store: Store<PlansElosState>,
    private firestoreService: FirestoreService
  ) { }

  requestGetPlanElos(uidPlan: string, uidUser: string) {
    return this.firestoreService.getPlanElos(uidPlan, uidUser);
  }

  savePlanElo(planElo: PlanElos) {
    return this.firestoreService.savePlanElo(planElo);
  }

  updatePlanElo(planElo: PlanElos) {
    return this.firestoreService.updatePlanElo(planElo);
  }

  async calculatePlanElos(
    puzzleElo: number, result: 1 | 0.5 | 0,
    planUid: string,
    uidUser: string,
    themes: string[],
    openingFamily: string,
  ) {

    const planElos: PlanElos = await firstValueFrom(this.store.select(getPlanElo(planUid)));
    let eloOpening = 1500;
    if (planElos) {
      if (openingFamily && planElos.openings) {
        eloOpening = calculateElo(planElos.openings[openingFamily] || 1500, puzzleElo, result);
      }
    } else {
      eloOpening = calculateElo(1500, puzzleElo, result);
    }

    themes.forEach(theme => {
      planElos.themes[theme] = calculateElo((planElos && planElos.themes[theme]) || 1500, puzzleElo, result);
    });

    // calcular el elo total del plan
    const currentTotalElo = planElos?.total ? planElos.total : 1500;
    const newTotalElo = calculateElo(currentTotalElo, puzzleElo, result);
    planElos.total = newTotalElo;

    if (openingFamily) {
      planElos.openings = {
        ...(planElos.openings || {}),
        [openingFamily]: eloOpening
      };
    }

    if (planElos.uid) {
      this.store.dispatch(requestUpdatePlanElos({ planElo: planElos }));
    } else {
      planElos.uidUser = uidUser;
      planElos.uidPlan = planUid;
      this.store.dispatch(requestAddOnePlanElo({ planElo: planElos }));
    }

  }
}

import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take, filter, switchMap } from 'rxjs/operators';
import { Observable, of, combineLatest } from 'rxjs';

import { PlansHistoryState } from '@redux/states/plans-history.state';
import { getCountAllPlansHistory } from '@redux/selectors/plans-history.selectors';
import { getProfile } from '@redux/selectors/auth.selectors';
import { PlanService } from '@services/plan.service';

@Injectable({
  providedIn: 'root'
})
export class PlansGuard {

  constructor(
    private planService: PlanService,
    private store: Store<PlansHistoryState>
  ) { }

  canActivate(): Observable<boolean> {
    // Permitir la activación sin bloquear
    this.checkPlansHistoryState();
    return of(true);
  }

  private checkPlansHistoryState(): void {
    const countPlansHistoryStates$ = this.store.pipe(
      select(getCountAllPlansHistory)
    );

    const profile$ = this.store.pipe(
      select(getProfile)
    );

    combineLatest([countPlansHistoryStates$, profile$]).pipe(
      filter(([countPlansHistoryStates, profile]) => profile !== null),
      take(1),
      switchMap(([countPlansHistoryStates, profile]) => {
        if (countPlansHistoryStates === 0 && profile) {
          // Realizar la petición si el historial de planes está vacío y hay un perfil disponible
          this.planService.requestGetPlansAction(profile.uid);
        }
        return of(null); // Retornar un observable vacío si no es necesario hacer la petición
      })
    ).subscribe();
  }
}

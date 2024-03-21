import { Injectable } from '@angular/core';




import { Store, select } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';

import { Observable, of, forkJoin, combineLatest } from 'rxjs';

import { PlansHistoryState } from '@redux/states/plans-history.state';

import { getCountAllPlansHistory } from '@redux/selectors/plans-history.selectors';
import { getProfile } from '@redux/selectors/auth.selectors';

import { PlanService } from '@services/plan.service';


@Injectable({
  providedIn: 'root'
})
export class PlansGuard  {

  constructor(
    private planService: PlanService,
    private store: Store<PlansHistoryState>
  ) { }

  canActivate(): Observable<boolean> {
    return forkJoin([
      this.checkPlansHistoryState(),
    ]).pipe(
      switchMap(() => of(true))
    );
  }


  private checkPlansHistoryState() {

    const countCoordinatesPuzzlesStates$ = this.store.pipe(
      select(getCountAllPlansHistory),
      take(1)
    );

    const profile$ = this.store.pipe(
      select(getProfile)
    );

    combineLatest([countCoordinatesPuzzlesStates$, profile$]).subscribe(data => {

      if (data[0] === 0 && data[1]) {
        this.planService.requestGetPlansAction(data[1].uid);
      }

    });

    return of(true);
  }


}

import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';

import { Observable, of, forkJoin, combineLatest } from 'rxjs';

import { PlansElosState } from '@redux/states/plans-elos.state';

import { getCountAllPlansElos } from '@redux/selectors/plans-elos.selectors';
import { getProfile } from '@redux/selectors/auth.selectors';

import { PlansElosService } from '@services/plans-elos.service';


@Injectable({
  providedIn: 'root'
})
export class PlansGuard {

  constructor(
    private plansElosService: PlansElosService,
    private store: Store<PlansElosState>
  ) { }

  canActivate(): Observable<boolean> {
    return forkJoin([
      this.checkPlansElosState(),
    ]).pipe(
      switchMap(() => of(true))
    );
  }


  private checkPlansElosState() {

    const countPlansElosStates$ = this.store.pipe(
      select(getCountAllPlansElos),
      take(1)
    );

    const profile$ = this.store.pipe(
      select(getProfile)
    );

    combineLatest([countPlansElosStates$, profile$]).subscribe(data => {

      if (data[0] === 0 && data[1]) {
        this.plansElosService.requestGetPlansAction(data[1].uid);
      }

    });

    return of(true);
  }


}

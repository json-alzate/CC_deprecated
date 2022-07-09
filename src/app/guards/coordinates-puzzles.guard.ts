import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';



import { Store, select } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';

import { Observable, of, forkJoin, combineLatest } from 'rxjs';

import { CoordinatesPuzzlesState } from '@redux/states/coordinates-puzzles.state';

import { requestGetCoordinatesPuzzles } from '@redux/actions/coordinates-puzzles.actions';

import { getCountAllCoordinatesPuzzles } from '@redux/selectors/coordinates-puzzles.selectors';
import { getProfile } from '@redux/selectors/auth.selectors';


@Injectable({
  providedIn: 'root'
})
export class CoordinatesPuzzlesGuard implements CanActivate {

  constructor(
    private store: Store<CoordinatesPuzzlesState>
  ) { }

  canActivate(): Observable<boolean> {
    return forkJoin([
      this.checkCoordinatesPuzzlesState(),
    ]).pipe(
      switchMap(() => of(true))
    );
  }


  private checkCoordinatesPuzzlesState() {

    const countCoordinatesPuzzlesStates$ = this.store.pipe(
      select(getCountAllCoordinatesPuzzles),
      take(1)
    );

    const profile$ = this.store.pipe(
      select(getProfile)
    );

    combineLatest([countCoordinatesPuzzlesStates$, profile$]).subscribe(data => {

      if (data[0] === 0 && data[1]) {
        this.requestLoadCoordinatesPuzzles(data[1].uid);
      }

    });

    return of(true);
  }


  private requestLoadCoordinatesPuzzles(uidUser: string) {
    console.log('llamar');
    // FIXME: se esta llamando dos a firestore por los juegos
    const action = requestGetCoordinatesPuzzles({ uidUser });
    this.store.dispatch(action);
  }

}

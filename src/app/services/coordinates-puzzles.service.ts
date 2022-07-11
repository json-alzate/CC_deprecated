import { Injectable } from '@angular/core';

import { CoordinatesPuzzle } from '@models/coordinates-puzzles.model';

import { FirestoreService } from '@services/firestore.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesPuzzlesService {

  constructor(
    private firestoreService: FirestoreService
  ) { }

  getCoordinatesPuzzles(uidUser: string): Observable<CoordinatesPuzzle[]> {

    return from<Promise<CoordinatesPuzzle[]>>(this.firestoreService.getCoordinatesPuzzles(uidUser));

  }

  addCoordinatesPuzzle(coordinatesPuzzle: CoordinatesPuzzle) {
    // TODO: modificar por un observable
    return this.firestoreService.addCoordinatesPuzzle(coordinatesPuzzle);
  }
}

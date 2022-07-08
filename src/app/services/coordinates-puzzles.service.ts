import { Injectable } from '@angular/core';

import { CoordinatesPuzzle } from '@models/coordinates-puzzles.model';

import { FirestoreService } from '@services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesPuzzlesService {

  constructor(
    private firestoreService: FirestoreService
  ) { }

  getCoordinatesPuzzles(uidUser: string) {
    return this.firestoreService.getCoordinatesPuzzles(uidUser);
  }

  addCoordinatesPuzzle(coordinatesPuzzle: CoordinatesPuzzle) {
    return this.firestoreService.addCoordinatesPuzzle(coordinatesPuzzle);
  }
}

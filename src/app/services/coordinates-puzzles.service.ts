import { Injectable } from '@angular/core';

import { CoordinatesGame } from '@models/coordinates.model';

import { FirestoreService } from '@services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesPuzzlesService {

  constructor(
    private firestoreService: FirestoreService
  ) { }

  addGameCoordinates(coordinatesGame: CoordinatesGame) {
    return this.firestoreService.addCoordinatesGame(coordinatesGame);
  }
}

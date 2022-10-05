import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Puzzle } from '@models/puzzle.model';

import { FirestoreService } from '@services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class PuzzlesService {

  constructor(
    private http: HttpClient,
    private firestoreService: FirestoreService
  ) { }


  getPuzzles(eloStart: number, eloEnd: number, limit: number) {

  }


  getPuzzlesToUpload() {
    this.http.get('/assets/data/puzzlesToUpload.csv', { responseType: 'text' }).subscribe(puzzles => {
      // console.log(puzzles);

      const list = puzzles.split('\n');
      // console.log(list);


      let index = 1;

      for (const puzzle of list) {
        const puzzleData = puzzle.split(',');
        // console.log(puzzleData);

        const puzzleToAdd: Puzzle = {
          uid: puzzleData[0],
          fen: puzzleData[1],
          moves: puzzleData[2],
          rating: Number(puzzleData[3]),
          ratingDeviation: Number(puzzleData[4]),
          popularity: Number(puzzleData[5]),
          nbPlays: Number(puzzleData[6]),
          themes: puzzleData[7].split(' '),
          gameUrl: puzzleData[8],
          openingFamily: puzzleData[9] || '',
          openingVariation: puzzleData[10] || ''
        };

        // 03vMK

        console.log(index);

        // this.firestoreService.adminAddNewPuzzle(puzzleToAdd);
        index++;
      }


    });
  }


}

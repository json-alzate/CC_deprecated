import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PuzzlesService {

  constructor(
    private http: HttpClient
  ) { }


  getPuzzlesToUpload() {
    this.http.get('/assets/data/puzzlesToUpload.csv', { responseType: 'text' }).subscribe(puzzles => {
      // console.log(puzzles);

      const list = puzzles.split('\n');
      console.log(list);

      // list.forEach(puzzle => {
      //   // const puzzleData = puzzle.split(',');
      //   console.log(puzzle);
      // });

    });
  }


}

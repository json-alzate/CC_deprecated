import { Component, OnInit } from '@angular/core';

import { PuzzlesService } from '@services/puzzles.service';

@Component({
  selector: 'app-puzzles',
  templateUrl: './puzzles.page.html',
  styleUrls: ['./puzzles.page.scss'],
})
export class PuzzlesPage implements OnInit {

  constructor(
    private puzzlesService: PuzzlesService
  ) {
    // this.puzzlesService.getPuzzlesToUpload();

  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { PuzzlesService } from '@services/puzzles.service';

@Component({
  selector: 'app-puzzles',
  templateUrl: './puzzles.page.html',
  styleUrls: ['./puzzles.page.scss'],
})
export class PuzzlesPage implements OnInit {

  constructor(
    private puzzlesService: PuzzlesService,
    private navController: NavController
  ) {
    // this.puzzlesService.getPuzzlesToUpload();

  }

  ngOnInit() {
  }

  goTo(path: string) {
    this.navController.navigateForward(path);
  }

}

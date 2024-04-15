import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  SQUARE_SELECT_TYPE,
  Chessboard,
  BORDER_TYPE
} from 'cm-chessboard';

// models
import { Puzzle } from '@models/puzzle.model';

// services
import { UiService } from '@services/ui.service';


@Component({
  selector: 'app-puzzle-solution',
  templateUrl: './puzzle-solution.component.html',
  styleUrls: ['./puzzle-solution.component.scss'],
})
export class PuzzleSolutionComponent implements OnInit {

  @Input() puzzle: Puzzle;

  board;

  constructor(
    private modalController: ModalController,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.buildBoard(this.puzzle.fen);
  }

  close() {
    this.modalController.dismiss();
  }

  buildBoard(fen) {
    // eslint-disable-next-line max-len
    // Se configura la ruta de las piezas con un timestamp para que no se guarde en cache (assetsCache: false, no se ven bien las piezas)
    const uniqueTimestamp = new Date().getTime();
    const piecesPath = `${this.uiService.pieces}?t=${uniqueTimestamp}`;

    const cssClass = this.uiService.currentBoardStyleSelected.name !== 'default' ? this.uiService.currentBoardStyleSelected.name : null;

    this.board = new Chessboard(document.getElementById('boardPuzzleSolution'), {
      responsive: true,
      position: fen,
      assetsUrl: '/assets/cm-chessboard/',
      assetsCache: true,
      style: {
        cssClass,
        borderType: BORDER_TYPE.thin,
        pieces: {
          file: piecesPath
        }
      }
    });

  }

}

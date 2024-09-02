import { Component, OnInit, Input } from '@angular/core';

import {
  Chessboard,
  BORDER_TYPE
} from 'cm-chessboard';
import { MARKER_TYPE, Markers } from 'cm-chessboard/src/extensions/markers/markers';

import { Block } from '@models/plan.model';


// utils
import { createUid } from '@utils/create-uid';

// services
import { UiService } from '@services/ui.service';

@Component({
  selector: 'app-puzzles-played-preview',
  templateUrl: './puzzles-played-preview.component.html',
  styleUrls: ['./puzzles-played-preview.component.scss'],
})
export class PuzzlesPlayedPreviewComponent implements OnInit {

  @Input() blocks: Block[] = [];
  uidBoard = createUid();
  board;
  constructor(
    private uiService: UiService
  ) { }

  ngOnInit() {
    // TODO: Iniciar a recorrer los bloques. primero para ordenar los puzzles jugados y resueltos,
    // luego los incorrectos y luego los incorrectos por tiempo
    // ordenados de mayor a menor elo
  }

  buildBoard() {
    const uniqueTimestamp = new Date().getTime();
    const piecesPath = `${this.uiService.pieces}?t=${uniqueTimestamp}`;

    const cssClass = this.uiService.currentBoardStyleSelected.name !== 'default' ? this.uiService.currentBoardStyleSelected.name : null;

    this.board = new Chessboard(document.getElementById('boardPuzzleSolution'), {
      responsive: true,
      assetsUrl: '/assets/cm-chessboard/',
      assetsCache: true,
      style: {
        cssClass,
        borderType: BORDER_TYPE.thin,
        pieces: {
          file: piecesPath
        }
      },
      extensions: [
        { class: Markers }
      ]
    });

    // this.turnRoundBoard(this.chessInstance.turn() === 'b' ? 'w' : 'b');
    // this.startMoves();

  }

}

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
import Chess from 'chess.js';
import { MARKER_TYPE, Markers } from 'cm-chessboard/src/extensions/markers/markers';


// models
import { Puzzle } from '@models/puzzle.model';

// services
import { UiService } from '@services/ui.service';
import { ToolsService } from '@services/tools.service';


@Component({
  selector: 'app-puzzle-solution',
  templateUrl: './puzzle-solution.component.html',
  styleUrls: ['./puzzle-solution.component.scss'],
})
export class PuzzleSolutionComponent implements OnInit {

  @Input() puzzle: Puzzle;

  board;
  chessInstance = new Chess();

  constructor(
    private modalController: ModalController,
    private uiService: UiService,
    private toolsService: ToolsService
  ) { }

  ngOnInit() {
    this.buildBoard(this.puzzle.fen);
  }

  close() {
    this.modalController.dismiss();
  }

  buildBoard(fen) {
    this.chessInstance.load(this.puzzle.fen);

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
      },
      extensions: [
        { class: Markers }
      ]
    });

    this.turnRoundBoard(this.chessInstance.turn() === 'b' ? 'w' : 'b');
    this.startMoves();

  }

  turnRoundBoard(orientation?: 'w' | 'b') {
    if (orientation) {
      this.board.setOrientation(orientation);
    } else {
      if (this.board.getOrientation() === 'w') {
        this.board.setOrientation('b');
      } else {
        this.board.setOrientation('w');
      }
    }
  }

  async startMoves() {
    const arrayFenSolution = [];
    const arrayMovesSolution = this.puzzle.moves.split(' ');
    arrayFenSolution.push(this.chessInstance.fen());
    for (const move of arrayMovesSolution) {
      this.chessInstance.move(move, { sloppy: true });
      const fen = this.chessInstance.fen();
      arrayFenSolution.push(fen);
    }

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < arrayFenSolution.length; i++) {
      let lastMove;
      if (!arrayFenSolution[i - 1]) {
        lastMove = this.puzzle.fen;
      } else {
        lastMove = arrayFenSolution[i - 1];
      }
      await this.board.setPosition(arrayFenSolution[i], true);
      this.toolsService.determineChessMoveType(lastMove, arrayFenSolution[i]);

      await new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), 1000);
      });

      if (arrayMovesSolution[i]) {
        const from = arrayMovesSolution[i].slice(0, 2);
        const to = arrayMovesSolution[i].slice(2, 4);
        this.showLastMove(from, to);
      }

    }

    setTimeout(() => this.close(), 1500);

  }

  showLastMove(from: string, to: string) {
    this.board.removeMarkers();

    const marker = { id: 'lastMove', class: 'marker-square-green', slice: 'markerSquare' };
    this.board.addMarker(marker, from);
    this.board.addMarker(marker, to);


  }

}

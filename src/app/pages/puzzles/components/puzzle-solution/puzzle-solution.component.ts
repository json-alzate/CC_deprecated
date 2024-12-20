import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import {
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
import { StockfishService } from '@services/stockfish.service';


@Component({
  selector: 'app-puzzle-solution',
  templateUrl: './puzzle-solution.component.html',
  styleUrls: ['./puzzle-solution.component.scss'],
})
export class PuzzleSolutionComponent implements OnInit {

  @Input() puzzle: Puzzle = {
    fen: '8/8/1p6/p1bP1Pkp/P1P1K3/4p3/4B3/8 w - - 1 50',
    moves: 'e4e5 h5h4 e5e4 h4h3 e2f3 h3h2',
    nbPlays: 1243,
    timeUsed: 19,
    openingVariation: '',
    popularity: 90,
    firstMoveSquaresHighlight: [
      'e4',
      'e5'
    ],
    times: {
      total: 20,
      warningOn: 12,
      dangerOn: 6
    },
    gameUrl: 'https://lichess.org/4pT4PGqi#98',
    uid: 'qyjOZ',
    openingFamily: '',
    rating: 1331,
    randomNumberQuery: 9788,
    themes: [
      'advancedPawn',
      'bishopEndgame',
      'crushing',
      'endgame',
      'long',
      'quietMove'
    ],
    ratingDeviation: 75,
    fenStartUserPuzzle: '8/8/1p6/p1bPKPkp/P1P5/4p3/4B3/8 b - - 2 50'
  };

  board;
  chessInstance = new Chess();
  closeCancelMoves = false;
  bestMove = '';

  constructor(
    private modalController: ModalController,
    private uiService: UiService,
    private toolsService: ToolsService,
    private stockfishService: StockfishService
  ) { }

  ngOnInit() {
    console.log(JSON.stringify(this.puzzle));
    this.buildBoard(this.puzzle.fen);

  }


  startStockfish() {
    // Inicia el motor y envía comandos
    this.stockfishService.postMessage('uci');
    setTimeout(() => {
      console.log('FEN', this.puzzle.fen);

      this.stockfishService.postMessage(
        'position fen 6B1/4b3/2p1P3/p5p1/1p3PK1/1Pk5/P7/8 b - - 0 57'
      );
      this.stockfishService.postMessage('go depth 15');
    }, 2000);
  }

  listenStockfish() {
    // Escucha los mensajes del motor
    this.stockfishService.onMessage((message) => {
      console.log('Stockfish:', message);

      if (message.startsWith('bestmove')) {
        this.bestMove = message.split(' ')[1]; // Extrae la mejor jugada
      }
    });
  }

  close() {
    this.closeCancelMoves = true;
    if (this.modalController) {
      this.modalController.dismiss();
    }
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
    // this.startMoves();

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
      if (this.closeCancelMoves) {
        break;
      }
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

    // setTimeout(() => this.close(), 1500);

  }

  showLastMove(from: string, to: string) {
    this.board.removeMarkers();
    const marker = { id: 'lastMove', class: 'marker-square-green', slice: 'markerSquare' };
    this.board.addMarker(marker, from);
    this.board.addMarker(marker, to);
  }

}

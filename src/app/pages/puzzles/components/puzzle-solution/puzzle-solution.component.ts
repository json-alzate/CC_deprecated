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

  currentMoveNumber = 0;
  arrayFenSolution = [];
  arrayMovesSolution = [];
  totalMoves = 0;
  allowMoveArrows = false;
  fenToCompareAndPlaySound: string;
  piecePathKingTurn = '';

  isClueActive = false;

  constructor(
    private modalController: ModalController,
    public uiService: UiService,
    private toolsService: ToolsService,
    private stockfishService: StockfishService
  ) { }

  ngOnInit() {
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
    this.piecePathKingTurn = this.chessInstance.turn() === 'b' ? 'wK.svg' : 'bK.svg';
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
    this.fenToCompareAndPlaySound = this.puzzle.fen;
    this.getMoves();
    // this.startMoves();

  }

  getMoves() {
    this.currentMoveNumber = 0;
    this.allowMoveArrows = false;

    this.arrayFenSolution = [];
    // se construye un arreglo con los fen de la solución
    this.arrayMovesSolution = this.puzzle.moves.split(' ');
    this.arrayFenSolution.push(this.chessInstance.fen());
    for (const move of this.arrayMovesSolution) {
      this.chessInstance.move(move, { sloppy: true });
      const fen = this.chessInstance.fen();
      this.arrayFenSolution.push(fen);
    }
    this.totalMoves = this.arrayFenSolution.length - 1;

    // ejecutar primera jugada
    this.puzzleMoveResponse();
  }


  async puzzleMoveResponse() {
    this.currentMoveNumber++;

    if (this.arrayFenSolution.length === this.currentMoveNumber) {
      this.allowMoveArrows = true;
      this.currentMoveNumber--;

    } else {

      await new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), 500);
      });

      this.chessInstance.load(this.arrayFenSolution[this.currentMoveNumber]);
      const fen = this.chessInstance.fen();
      this.toolsService.determineChessMoveType(this.fenToCompareAndPlaySound, fen);
      this.fenToCompareAndPlaySound = fen;
      this.board.removeMarkers();
      // this.board.removeArrows();

      await this.board.setPosition(fen, true);
      const from = this.arrayMovesSolution[this.currentMoveNumber - 1].slice(0, 2);
      const to = this.arrayMovesSolution[this.currentMoveNumber - 1].slice(2, 4);
      this.showLastMove(from, to);

    }


  }

  async showClue(times?: number) {

    // Marcar el inicio de la ejecución
    if (!times) {
      this.isClueActive = true;
      times = 1; // Inicializa `times` si no se proporciona.
    }

    const square = this.puzzle.moves.split(' ')[this.currentMoveNumber].slice(0, 2);
    if (!square) {
      console.error('No square to mark');
      this.isClueActive = false;
      return;
    }

    // Limpia cualquier marca previa que no sea 'lastMove'.
    const markersOnSquare = this.board.getMarkers(undefined, square);
    markersOnSquare.forEach(marker => {
      if (marker.type.id !== 'lastMove') {
        this.board.removeMarkers(marker.type, square);
      }
    });

    // Alterna el marcador para simular parpadeo.
    const markerToAdd = { id: 'clue', class: 'marker-square-clue', slice: 'markerSquare' };
    if (times % 2 === 1) {
      // Añade marcador.
      this.board.addMarker(markerToAdd, square);
    } else {
      // Elimina marcador.
      this.board.removeMarkers(markerToAdd, square);
    }

    // Detén el parpadeo después de 8 alternancias.
    if (times === 8) {
      this.isClueActive = false; // Libera la bandera
      return;
    }

    // Repite después de 500ms
    setTimeout(() => this.showClue(times + 1), 500);
  }


  // Board controls -----------------------------------

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

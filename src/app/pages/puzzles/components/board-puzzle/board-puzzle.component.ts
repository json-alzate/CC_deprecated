import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  SQUARE_SELECT_TYPE,
  Chessboard,
  BORDER_TYPE
} from 'cm-chessboard';
import { MARKER_TYPE, Markers } from 'cm-chessboard/src/extensions/markers/markers';
import { ARROW_TYPE, Arrows } from 'cm-chessboard/src/extensions/arrows/arrows';
import { PromotionDialog } from 'cm-chessboard/src/extensions/promotion-dialog/PromotionDialog';
import Chess from 'chess.js';

// rxjs
import { interval, Subject, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// models
import { Puzzle } from '@models/puzzle.model';

interface UISettings {
  allowBackMove: boolean;
  allowNextMove: boolean;
  allowNextPuzzle: boolean;
  currentMoveNumber: number;
  isRetrying: boolean;
  puzzleStatus: 'start' | 'wrong' | 'good' | 'finished' | 'showSolution' | 'isRetrying';
  isPuzzleCompleted: boolean;
}

// Services
import { UiService } from '@services/ui.service';
import { ToolsService } from '@services/tools.service';

@Component({
  selector: 'app-board-puzzle',
  templateUrl: './board-puzzle.component.html',
  styleUrls: ['./board-puzzle.component.scss'],
})
export class BoardPuzzleComponent implements OnInit {

  puzzle: Puzzle;

  currentMoveNumber = 0;
  arrayFenSolution = [];
  totalMoves = 0;
  allowMoveArrows = false;
  fenToCompareAndPlaySound: string;


  // timer
  time = 0;
  timeColor = 'success';
  subsSeconds: Observable<number>;


  board;
  chessInstance = new Chess();

  constructor(
    private uiService: UiService,
    private toolsService: ToolsService
  ) { }
  @Input() set setPuzzle(data: Puzzle) {
    if (data) {
      this.puzzle = data;
      console.log('puzzle', this.puzzle);

      this.initPuzzle();
    }
  }

  ngOnInit() {
    if (!this.board) {
      this.buildBoard('8/8/8/8/8/8/8/8 w - - 0 1');
    }
  }


  initPuzzle() {
    if (this.board) {
      this.board.setPosition(this.puzzle.fen);
    } else {
      this.buildBoard(this.puzzle.fen);
    }
    this.chessInstance.load(this.puzzle.fen);
    this.fenToCompareAndPlaySound = this.puzzle.fen;
    // Se cambia el color porque luego se realizara automáticamente la jugada inicial de la maquina
    // el fen del puzzle inicia siempre con el color contrario al del que le toca jugar al usuario
    this.turnRoundBoard(this.chessInstance.turn() === 'b' ? 'w' : 'b');
    this.currentMoveNumber = 0;
    this.allowMoveArrows = false;

    this.arrayFenSolution = [];
    // se construye un arreglo con los fen de la solución
    const movesArray = this.puzzle.moves.split(' ');
    this.arrayFenSolution.push(this.chessInstance.fen());
    for (const move of movesArray) {
      this.chessInstance.move(move, { sloppy: true });
      const fen = this.chessInstance.fen();
      this.arrayFenSolution.push(fen);
    }
    this.totalMoves = this.arrayFenSolution.length - 1;

    // ejecutar primera jugada
    this.puzzleMoveResponse();



    // this.initTimer();
  }


  /**
   * Build board ui
   */
  buildBoard(fen: string) {

    // Se configura la ruta de las piezas con un timestamp para que no se guarde en cache (assetsCache: false, no se ven bien las piezas)
    const uniqueTimestamp = new Date().getTime();
    const piecesPath = `${this.uiService.pieces}?t=${uniqueTimestamp}`;

    const cssClass = this.uiService.currentBoardStyleSelected.name !== 'default' ? this.uiService.currentBoardStyleSelected.name : null;


    this.board = new Chessboard(document.getElementById('boardPuzzle'), {
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
        { class: Markers },
        { class: Arrows },
        { class: PromotionDialog }
      ]
    });

    this.board.enableMoveInput((event) => {

      // handle user input here
      switch (event.type) {

        case 'moveInputStarted':
          // mostrar indicadores para donde se puede mover la pieza
          this.board.removeMarkers();
          this.board.removeArrows();

          if (this.chessInstance.moves({ square: event.square }).length > 0) {
            // adiciona el marcador para la casilla seleccionada
            const markerSquareSelected = { class: 'marker-square-green', slice: 'markerSquare' };
            this.board.addMarker(markerSquareSelected, event.square);
            const possibleMoves = this.chessInstance.moves({ square: event.square, verbose: true });
            for (const move of possibleMoves) {
              const markerDotMove = { class: 'marker-dot-green', slice: 'markerDot' };
              this.board.addMarker(markerDotMove, move.to);
            }
          }
          return true;
        case 'validateMoveInput':


          if ((event.squareTo.charAt(1) === '8' || event.squareTo.charAt(1) === '1') && event.piece.charAt(1) === 'p') {

            const colorToShow = event.piece.charAt(0) === 'w' ? COLOR.white : COLOR.black;

            this.board.showPromotionDialog(event.squareTo, colorToShow, (result) => {
              if (result && result.piece) {
                this.board.setPiece(result.square, result.piece, true);
                // remover la piece de la casilla de origen
                this.board.setPiece(event.squareFrom, undefined, true);
                const objectMovePromotion = { from: event.squareFrom, to: event.squareTo, promotion: result.piece.charAt(1) };
                const theMovePromotion = this.chessInstance.move(objectMovePromotion);
                if (theMovePromotion) {
                  this.validateMove();
                }
              } else {
                console.log('Promotion canceled');
              }
            });
          }

          const objectMove = { from: event.squareFrom, to: event.squareTo };
          const theMove = this.chessInstance.move(objectMove);

          if (theMove) {
            this.validateMove();
          }
          // return true, if input is accepted/valid, `false` takes the move back
          return theMove;
        case 'moveInputCanceled':
          // hide the indicators
          return true;
        case 'moveInputFinished':
          this.board.removeMarkers();
          this.board.removeArrows();
          break;
        default:
          return true;
      }
    });


    let startSquare;
    let endSquare;
    this.board.enableSquareSelect((event) => {


      const ctrKeyPressed = event.mouseEvent.ctrlKey;
      const shiftKeyPressed = event.mouseEvent.shiftKey;
      const altKeyPressed = event.mouseEvent.altKey;

      if (event.mouseEvent.type === 'mousedown' && event.mouseEvent.which === 3) { // click derecho
        startSquare = event.square;
      }


      if (event.mouseEvent.type === 'mouseup' && event.mouseEvent.which === 3) { // liberar click derecho
        endSquare = event.square;

        if (startSquare === endSquare) {
          return;
        }

        // Ahora, dibujamos la flecha usando el inicio y el final de las coordenadas
        let arrowType = {
          class: 'arrow-green',
          headSize: 7,
          slice: 'arrowDefault'
        };

        if (shiftKeyPressed) {
          arrowType = { ...arrowType, class: 'arrow-blue' };
        } else if (altKeyPressed) {
          arrowType = { ...arrowType, class: 'arrow-yellow' };
        } else if (ctrKeyPressed) {
          arrowType = { ...arrowType, class: 'arrow-red' };
        }


        this.board.addArrow(arrowType, startSquare, endSquare);
      }


      if (event.type === SQUARE_SELECT_TYPE.primary && event.mouseEvent.type === 'mousedown') {

        if (!this.chessInstance.get(event.square)) {
          this.board.removeArrows();
          this.board.removeMarkers();
        }

      }

      if (event.type === SQUARE_SELECT_TYPE.secondary && event.mouseEvent.type === 'mousedown') {

        let classCircle = 'marker-circle-green';

        if (ctrKeyPressed) {
          classCircle = 'marker-circle-red';
        } else if (shiftKeyPressed) {
          classCircle = 'marker-circle-blue';
        } else if (altKeyPressed) {
          classCircle = 'marker-circle-yellow';
        }

        let myOwnMarker = { class: classCircle, slice: 'markerCircle' };

        if (ctrKeyPressed && shiftKeyPressed && altKeyPressed) {
          myOwnMarker = MARKER_TYPE.frame;
        }


        const markersOnSquare = this.board.getMarkers(undefined, event.square);
        if (markersOnSquare.length > 0) {
          this.board.removeMarkers(undefined, event.square);
        } else {

          this.board.addMarker(myOwnMarker, event.square);
        }


      }
    });

  }



  validateMove() {
    const fenChessInstance = this.chessInstance.fen();

    // this.toolsService.determineChessMoveType(this.fenToCompare, fenChessInstance);

    this.currentMoveNumber++;
    if (fenChessInstance === this.arrayFenSolution[this.currentMoveNumber] || this.chessInstance.in_checkmate()) {
      this.puzzleMoveResponse();
    } else {
      // TODO: puzzle resuelto incorrectamente
      console.log('puzzle resuelto incorrectamente');

    }

    // Actualiza el tablero después de un movimiento de enroque
    if (
      this.chessInstance.history({ verbose: true }).slice(-1)[0]?.flags.includes('k') ||
      this.chessInstance.history({ verbose: true }).slice(-1)[0]?.flags.includes('q')) {
      this.board.setPosition(this.chessInstance.fen());
    }
  }

  /**
   * Reacciona con el siguiente movimiento en el puzzle, cuando el usuario realiza una jugada correcta
   * React with the following movement in the puzzle, when the user makes a correct move
   *
   * @param moveNumber: number
   */
  async puzzleMoveResponse() {
    this.currentMoveNumber++;

    if (this.arrayFenSolution.length === this.currentMoveNumber) {

      // TODO: puzzle resuelto
      this.allowMoveArrows = true;
      this.currentMoveNumber--;

      // this.saveUserPuzzle();
      // this.stopTimer();
    } else {

      await new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), 1000);
      });

      this.chessInstance.load(this.arrayFenSolution[this.currentMoveNumber]);
      const fen = this.chessInstance.fen();
      this.toolsService.determineChessMoveType(this.fenToCompareAndPlaySound, fen);
      this.fenToCompareAndPlaySound = fen;
      this.board.removeMarkers();
      this.board.removeArrows();

      await this.board.setPosition(fen, true);

    }


  }


  // Board controls -----------------------------------

  /**
   * Gira el tablero
   * Turn the board
   *
   * @param orientation
   */
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

  // Arrows

  starPosition() {
    this.board.removeArrows();
    this.board.removeMarkers();
    this.board.setPosition(this.puzzle.fen, true);
    this.chessInstance.load(this.puzzle.fen);
    this.fenToCompareAndPlaySound = this.chessInstance.fen();
    this.currentMoveNumber = 0;
  }

  /**
   * Navega a la anterior jugada en el tablero
   * Navigate to the previous play on the board
   *
   */
  backMove() {
    if (this.currentMoveNumber <= 0) {
      return;
    } else {
      this.currentMoveNumber--;
    }
    this.board.removeMarkers();
    this.board.removeArrows();
    this.toolsService.determineChessMoveType(this.fenToCompareAndPlaySound, this.chessInstance.fen());
    this.chessInstance.load(this.arrayFenSolution[this.currentMoveNumber]);
    this.board.setPosition(this.arrayFenSolution[this.currentMoveNumber], true);
    this.chessInstance.load(this.arrayFenSolution[this.currentMoveNumber]);
  }

  /**
   * Navega a la siguiente jugada en el tablero
   * Navigate to the next play on the board
   *
   */
  nextMove() {
    if (this.currentMoveNumber >= this.totalMoves) {
      return;
    } else {
      this.currentMoveNumber++;
    }
    // aquí setear el tablero con la siguiente jugada
    this.board.removeMarkers();
    this.board.removeArrows();
    this.toolsService.determineChessMoveType(this.fenToCompareAndPlaySound, this.chessInstance.fen());
    this.board.setPosition(this.arrayFenSolution[this.currentMoveNumber], true);
    this.chessInstance.load(this.arrayFenSolution[this.currentMoveNumber]);
    this.fenToCompareAndPlaySound = this.chessInstance.fen();

  }

  moveToEnd() {
    this.currentMoveNumber = this.totalMoves;
    this.board.removeMarkers();
    this.board.removeArrows();
    this.board.setPosition(this.arrayFenSolution[this.currentMoveNumber], true);
    this.chessInstance.load(this.arrayFenSolution[this.currentMoveNumber]);
    this.fenToCompareAndPlaySound = this.chessInstance.fen();
  }

}

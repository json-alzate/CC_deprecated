// TODO: asegurarse de que chess js tenga el mismo fen siempre que se muestre en el tablero , para que el engine trabaje bien
// sucede mucho al adelantar o atrasar la jugada


//core and third party libraries
import { Component, OnInit } from '@angular/core';


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
import { createUid } from '@utils/create-uid';
import { randomNumber } from '@utils/random-number';
import { calculateElo } from '@utils/calculate-elo';

// rxjs
import { interval, Subject, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';






// models
import { Puzzle } from '@models/puzzle.model';
import { Profile } from '@models/profile.model';
import { UserPuzzle } from '@models/user-puzzles.model';
import { Evaluation } from '@models/engine.model';
import { PiecesStyle } from '@models/ui.model';

interface UISettings {
  allowBackMove: boolean;
  allowNextMove: boolean;
  allowNextPuzzle: boolean;
  currentMoveNumber: number;
  isRetrying: boolean;
}

// services
import { PuzzlesService } from '@services/puzzles.service';
import { ProfileService } from '@services/profile.service';
import { UserPuzzlesService } from '@services/user-puzzles.service';
import { AppService } from '@services/app.service';
import { ToolsService } from '@services/tools.service';
import { EngineService } from '@services/engine.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit {


  uiSet: UISettings = {
    allowBackMove: false,
    allowNextMove: false,
    allowNextPuzzle: false,
    currentMoveNumber: 0,
    isRetrying: false
  };

  profile: Profile;


  // timer
  time = 0;
  timeColor = 'success';
  subsSeconds: Observable<number>;

  board;
  chessInstance = new Chess();

  puzzleToResolve: Puzzle;
  fenSolution: string[] = [];

  // Se utiliza para determinar el tipo de movimiento y reproducir el sonido adecuado
  fenToCompare: string;

  // puzzle status and info for user
  puzzleColor: 'b' | 'w' = 'w';
  puzzleStatus: 'start' | 'wrong' | 'good' | 'finished' | 'showSolution' | 'isRetrying' = 'start';
  isPuzzleCompleted = false;

  eloToShow: number;
  eloLessSum: number;

  engineWorking = false;
  subscribeEngine: Subscription;


  // MOdificar esto a como esta en la libreria de lullalib
  private unsubscribe$ = new Subject<void>();
  private unsubscribeIntervalSeconds$ = new Subject<void>();

  // FIXME: no se realiza el enroque bien, solo se mueve el rey las dos casillas pero la torre no se mueve

  constructor(
    private puzzlesService: PuzzlesService,
    private profileService: ProfileService,
    private userPuzzlesService: UserPuzzlesService,
    public appService: AppService,
    private toolsService: ToolsService,
    private engineService: EngineService
  ) {
    this.profileService.subscribeToProfile().subscribe(profile => {
      this.profile = profile;
      if (profile?.eloPuzzles) {
        this.eloToShow = profile.eloPuzzles;
      }
    });


  }

  ngOnInit() {

    // this.puzzlesService.getTotalPuzzlesInDB().then(totalPuzzles => {
    //   console.log('totalPuzzles', totalPuzzles);
    // });

    // this.puzzlesService.getOnePuzzleByUid('090As').then(puzzle => {
    //   console.log('puzzle', JSON.stringify(puzzle));
    // });


  }

  ionViewDidEnter() {
    this.loadPuzzle();
    this.subscribeToPiecesStyle();
  }

  subscribeToPiecesStyle() {
    this.appService.listenPiecesStyle().subscribe((piecesStyle: PiecesStyle) => {
      if (this.board) {
        this.changePieceStyle(piecesStyle);
      }
    });
  }


  changePieceStyle(newPieceStyle: string) {
    // Actualiza la configuración del tablero
    this.board.destroy();
    this.board = null;
    const boardElement = document.getElementById('boardPuzzle');
    while (boardElement.firstChild) {
      boardElement.removeChild(boardElement.firstChild);
    }
    const spriteDiv = document.getElementById('cm-chessboard-sprite');
    if (spriteDiv) {
      spriteDiv.parentNode.removeChild(spriteDiv);
    }

    console.log(this.appService.pieces);
    // espera un segundo para que se destruya el tablero
    setTimeout(() => {
      this.loadBoard();
    }, 1000);

  }


  switchEngine(engineSetStatus: 'start' | 'stop' | 'toggle' = 'toggle') {

    switch (engineSetStatus) {
      case 'start':
        this.engineWorking = true;
        break;
      case 'stop':
        this.engineWorking = false;
        break;
      case 'toggle':
        this.engineWorking = !this.engineWorking;
        break;
    }

    // se adiciona un marker para mostrar la mejor jugada
    const markerArrowEngine = { class: 'arrow-pointy', headSize: 7, slice: 'arrowPointy' };

    if (this.engineWorking) {
      this.subscribeEngine?.unsubscribe();
      // console.log(this.chessInstance.fen());

      const fenToEvaluate = this.chessInstance.fen();

      this.subscribeEngine = this.engineService.getBestMove(fenToEvaluate).subscribe((evaluationData: Evaluation) => {

        // se convierte el string de la mejor jugada. por ejemplo: De4 a un objeto {from: 'd2', to: 'd4'}
        // Validar que sea el mismo fen y no mostrar flechas que no corresponden a eventos que se queden en cola
        if (fenToEvaluate === this.chessInstance.fen()) {

          const bestMove = this.toolsService.moveSANToUCI(evaluationData.bestMove, fenToEvaluate);

          if (bestMove) {
            const arrowsOnSquare = this.board.getArrows(undefined, bestMove.from, bestMove.to);
            if (arrowsOnSquare.length > 0) {
              this.board.removeArrows(undefined, bestMove.from, bestMove.to);
            }
            this.board.removeArrows(undefined, undefined, undefined, 'arrowPointy');
            this.board.addArrow(markerArrowEngine, bestMove.from, bestMove.to);
          }
        }


      });
    } else {
      // busca los arrows pointy y los elimina
      this.board.removeArrows(undefined, undefined, undefined, 'arrowPointy');
      this.engineService.stopEvaluation();
    }


  }


  configsStart() {
    this.time = 0;
    this.timeColor = 'success';
    this.uiSet = {
      allowBackMove: false,
      allowNextMove: false,
      allowNextPuzzle: false,
      currentMoveNumber: 0,
      isRetrying: false
    };
    this.puzzleStatus = 'start';
  }



  async loadPuzzle() {

    this.puzzleToResolve = await this.puzzlesService.getPuzzle(this.eloToShow || 1500);


    // console.log(JSON.stringify(this.puzzleToResolve));

    // detiene el engine si esta encendido
    if (this.engineWorking) {
      this.switchEngine('stop');
    }

    this.fenSolution = [];
    const chessInstance = new Chess(this.puzzleToResolve.fen);
    this.fenToCompare = this.puzzleToResolve.fen;
    const movesArray = this.puzzleToResolve.moves.split(' ');

    // se construye un arreglo con los fen de la solución
    this.fenSolution.push(chessInstance.fen());
    for (const move of movesArray) {
      chessInstance.move(move, { sloppy: true });
      const fen = chessInstance.fen();
      this.fenSolution.push(fen);
    }

    this.loadBoard();
  }


  async loadBoard() {

    // Se carga el primer fen, para luego hacer el movimiento automático y que quede el efecto de tal movimiento
    this.chessInstance.load(this.puzzleToResolve.fen);

    // Se cambia el color porque luego se realizara automáticamente la jugada inicial de la maquina
    this.puzzleColor = this.chessInstance.turn() === 'b' ? 'w' : 'b';

    // Se valida si es la primera vez que se carga el tablero
    if (!this.board) {

      const uniqueTimestamp = new Date().getTime();
      const piecesPath = `${this.appService.pieces}?t=${uniqueTimestamp}`;;
      console.log(piecesPath);


      this.board = new Chessboard(document.getElementById('boardPuzzle'), {
        responsive: true,
        position: this.puzzleToResolve.fen,
        assetsUrl: '/assets/cm-chessboard/',
        assetsCache: true,
        style: {
          // cssClass: 'chessboard-js',
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

            if (this.chessInstance.turn() === this.puzzleColor && this.chessInstance.moves({ square: event.square }).length > 0) {
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

    } else {
      // Ya el tablero fue cargado la primera vez
      this.board.setPosition(this.fenSolution[this.uiSet.currentMoveNumber]);
    }



    this.turnRoundBoard(this.puzzleColor);
    this.puzzleMoveResponse();
    this.initTimer();
  }



  /**
   * Build board ui
   */
  buildBoard() {

  }



  validateMove() {
    const fenChessInstance = this.chessInstance.fen();

    this.toolsService.determineChessMoveType(this.fenToCompare, fenChessInstance);

    this.uiSet.currentMoveNumber++;
    if (fenChessInstance === this.fenSolution[this.uiSet.currentMoveNumber] || this.chessInstance.in_checkmate()) {
      this.uiSet.allowBackMove = true;
      this.puzzleStatus = 'good';
      this.puzzleMoveResponse();
    } else {
      this.puzzleStatus = 'wrong';
      this.isPuzzleCompleted = true;
      this.saveUserPuzzle();
      this.stopTimer();
    }

    // Actualiza el tablero después de un movimiento de enroque
    if (
      this.chessInstance.history({ verbose: true }).slice(-1)[0]?.flags.includes('k') ||
      this.chessInstance.history({ verbose: true }).slice(-1)[0]?.flags.includes('q')) {
      this.board.setPosition(this.chessInstance.fen());
    }
  }



  // Timer -----------------------------------

  initTimer() {
    if (!this.subsSeconds) {
      this.time = 0;
      const seconds = interval(1000);
      this.subsSeconds = seconds.pipe(
        takeUntil(this.unsubscribeIntervalSeconds$)
      );
      this.subsSeconds.subscribe(() => {
        this.time = this.time + 1;
        // Cambiar el color de la barra de progreso
        // Change the color of the progress bar
        if (this.time > 420) {
          this.timeColor = 'danger';
        } else if (this.time > 180 && this.time < 420) {
          this.timeColor = 'warning';
        } else {
          this.timeColor = 'success';
        }
      });
    }
  }

  stopTimer() {
    this.unsubscribeIntervalSeconds$.next();
    this.subsSeconds = null;
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
    this.board.setPosition(this.puzzleToResolve.fen, true);
    this.chessInstance.load(this.puzzleToResolve.fen);
    this.fenToCompare = this.chessInstance.fen();
    this.uiSet.currentMoveNumber = 0;
    this.uiSet.allowBackMove = false;
    this.uiSet.allowNextMove = true;
  }

  /**
   * Navega a la anterior jugada en el tablero
   * Navigate to the previous play on the board
   *
   * @param isForRetry: boolean
   * determina si se habilita el botón para mover a la siguiente jugada
   * isForRetry = true // no permite habilitar el botón, porque indica que se devolvió la jugada por intentar de nuevo
   */
  backMove(isForRetry = false) {
    this.uiSet.currentMoveNumber--;
    if (isForRetry) {
      this.uiSet.isRetrying = true;
      this.puzzleStatus = 'isRetrying';
    } else {
      this.uiSet.allowNextMove = true;
    }
    this.board.removeMarkers();
    this.board.removeArrows();
    this.toolsService.determineChessMoveType(this.fenToCompare, this.chessInstance.fen());
    this.chessInstance.load(this.fenSolution[this.uiSet.currentMoveNumber]);
    this.board.setPosition(this.fenSolution[this.uiSet.currentMoveNumber], true);
    this.chessInstance.load(this.fenSolution[this.uiSet.currentMoveNumber]);

    if (this.uiSet.currentMoveNumber === 0) {
      this.uiSet.allowBackMove = false;
    }

  }

  /**
   * Navega a la siguiente jugada en el tablero
   * Navigate to the next play on the board
   *
   */
  nextMove() {
    this.uiSet.allowBackMove = true;
    this.uiSet.currentMoveNumber++;
    // aquí setear el tablero con la siguiente jugada
    this.board.removeMarkers();
    this.board.removeArrows();
    this.toolsService.determineChessMoveType(this.fenToCompare, this.chessInstance.fen());
    this.board.setPosition(this.fenSolution[this.uiSet.currentMoveNumber], true);
    this.chessInstance.load(this.fenSolution[this.uiSet.currentMoveNumber]);
    this.fenToCompare = this.chessInstance.fen();
    if (this.uiSet.currentMoveNumber === this.fenSolution.length - 1) {
      this.uiSet.allowNextMove = false;
    }

  }

  moveToEnd() {
    this.uiSet.allowBackMove = true;
    this.uiSet.allowNextMove = false;
    this.uiSet.currentMoveNumber = this.fenSolution.length - 1;
    this.board.removeMarkers();
    this.board.removeArrows();
    this.board.setPosition(this.fenSolution[this.fenSolution.length - 1], true);
    this.chessInstance.load(this.fenSolution[this.fenSolution.length - 1]);
    this.fenToCompare = this.chessInstance.fen();
  }


  /**
   * Reacciona con el siguiente movimiento en el puzzle, cuando el usuario realiza una jugada correcta
   * React with the following movement in the puzzle, when the user makes a correct move
   *
   * @param moveNumber: number
   */
  async puzzleMoveResponse() {
    this.uiSet.currentMoveNumber++;

    if (this.fenSolution.length === this.uiSet.currentMoveNumber) {
      this.puzzleStatus = 'finished';
      this.isPuzzleCompleted = true;
      this.uiSet = { ...this.uiSet, allowNextPuzzle: true };
      this.saveUserPuzzle();
      this.stopTimer();
    } else {

      await new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), 1000);
      });

      this.chessInstance.load(this.fenSolution[this.uiSet.currentMoveNumber]);
      const fen = this.chessInstance.fen();
      this.toolsService.determineChessMoveType(this.fenToCompare, fen);
      this.fenToCompare = fen;
      this.board.removeMarkers();
      this.board.removeArrows();

      await this.board.setPosition(fen, true);
      if (this.engineWorking) {
        this.switchEngine('start');
      }
    }


  }


  showSolution() {
    this.uiSet = { ...this.uiSet, allowNextPuzzle: true };
    if (this.puzzleStatus !== 'wrong' && this.puzzleStatus !== 'isRetrying') {
      this.saveUserPuzzle();
    }
    if (this.uiSet.currentMoveNumber < this.fenSolution.length - 1) {
      this.uiSet.allowNextMove = true;
    }

    if (this.puzzleStatus === 'wrong') {
      this.uiSet.currentMoveNumber--;
    }

    this.nextMove();

    // importante no cambiar antes de llamar a nextMove
    this.puzzleStatus = 'showSolution';
    this.stopTimer();
  }

  nextPuzzle() {
    this.configsStart();
    this.loadPuzzle();
  }

  saveUserPuzzle() {
    if (this.uiSet.isRetrying) {
      return;
    }


    const userPuzzle: UserPuzzle = {
      uid: createUid(),
      date: new Date().getTime(),
      resolvedTime: this.time,
      uidUser: this.profile?.uid,
      currentEloUser: this.eloToShow || this.profile?.eloPuzzles || 1500,
      uidPuzzle: this.puzzleToResolve.uid,
      resolved: (this.puzzleStatus === 'good' || this.puzzleStatus === 'finished') ? true : false,
      eloPuzzle: this.puzzleToResolve.rating,
      themes: this.puzzleToResolve.themes,
      openingFamily: this.puzzleToResolve.openingFamily,
      openingVariation: this.puzzleToResolve.openingVariation
    };

    if (!this.eloToShow) {
      this.eloToShow = this.profile?.eloPuzzles || 1500;
    }

    const eloBeforeCalculate = this.eloToShow;
    this.eloToShow = calculateElo(this.eloToShow, userPuzzle.eloPuzzle, userPuzzle.resolved ? 1 : 0);
    this.eloLessSum = Math.abs(this.eloToShow - eloBeforeCalculate);

    // Guarda el puzzle en la base de datos
    this.userPuzzlesService.saveUserPuzzle(userPuzzle);
  }


}

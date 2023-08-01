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
import Chess from 'chess.js';
import { createUid } from '@utils/create-uid';
import { randomNumber } from '@utils/random-number';
import { calculateElo } from '@utils/calculate-elo';

// rxjs
import { interval, pipe, Subject, combineLatest, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';






// models
import { Puzzle } from '@models/puzzle.model';
import { Profile } from '@models/profile.model';
import { UserPuzzle } from '@models/user-puzzles.model';

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


// components


// FIXME: Con el siguiente ejercicio el puzzle es imposible de resolver porque incluye una coronación
// TODO: Validar coronación
/*
fen: "7r/6RP/2p5/8/2k4K/1p6/5P2/8 w - - 0 50"
gameUrl: "https://lichess.org/P16cwZZd#99"
moves: "h4h5 b3b2 g7b7 h8h7 b7h7 b2b1q"
nbPlays: 2892
openingFamily: "\r"
openingVariation: ""
popularity: 93
randomNumberQuery: 7508
rating: 1449
ratingDeviation: 75
themes:  ['advancedPawn', 'crushing', 'deflection', 'endgame', 'long', 'promotion', 'rookEndgame']
uid: "02fzY"

*/

// FIXME: el rating de puzzles mostrado no es correcto, por ejemplo a un usuario con 2200 se le muestran ejercicios de 1100


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

  // puzzle status and info for user
  puzzleColor: 'b' | 'w' = 'w';
  puzzleStatus: 'start' | 'wrong' | 'good' | 'finished' | 'showSolution' | 'isRetrying' = 'start';
  isPuzzleCompleted = false;

  eloToShow: number;
  eloLessSum: number;


  // MOdificar esto a como esta en la libreria de lullalib
  private unsubscribe$ = new Subject<void>();
  private unsubscribeIntervalSeconds$ = new Subject<void>();

  constructor(
    private puzzlesService: PuzzlesService,
    private profileService: ProfileService,
    private userPuzzlesService: UserPuzzlesService
  ) {
    this.profileService.subscribeToProfile().subscribe(profile => {
      this.profile = profile;
      if (profile?.eloPuzzles) {
        this.eloToShow = profile.eloPuzzles;
      }
    });
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.loadPuzzle();
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
    console.log('this.puzzleToResolve ', this.puzzleToResolve);

    this.fenSolution = [];
    const chessInstance = new Chess(this.puzzleToResolve.fen);
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

    console.log('loadBoard');


    // Se carga el primer fen, para luego hacer el movimiento automático y que quede el efecto de tal movimiento
    this.chessInstance.load(this.puzzleToResolve.fen);

    // Se cambia el color por que luego se realizara automáticamente la jugada inicial de la maquina
    this.puzzleColor = this.chessInstance.turn() === 'b' ? 'w' : 'b';

    // Se valida si es la primera vez que se carga el tablero
    if (!this.board) {
      this.board = new Chessboard(document.getElementById('boardPuzzle'), {
        responsive: true,
        position: this.puzzleToResolve.fen,
        assetsUrl: '/assets/cm-chessboard/',
        style: {
          borderType: BORDER_TYPE.thin,
          pieces: {
            file: '/assets/images/chessboard-sprite-staunty.svg'
          }
        },
        extensions: [
          { class: Markers },
          { class: Arrows }
        ]
      });

      // this.board.addArrow(ARROW_TYPE.default, 'f3', 'd5');
      // this.board.addArrow(ARROW_TYPE.default, 'f3', 'd5');
      // this.board.addArrow(ARROW_TYPE.default, 'b8', 'c6');
      // this.board.addArrow(ARROW_TYPE.pointy, 'd2', 'd3');
      // this.board.addArrow(ARROW_TYPE.danger, 'g5', 'e6');
      // console.log(this.board.getArrows());

      this.board.enableMoveInput((event) => {
        console.log('event ', event);

        // handle user input here
        switch (event.type) {
          case 'moveInputStarted':
            // mostrar indicadores para donde se puede mover la pieza
            console.log('this.uiSet.allowBackMove ');
            return true;

          case 'validateMoveInput':

            const objectMove = { from: event.squareFrom, to: event.squareTo };
            const theMove = this.chessInstance.move(objectMove);

            if (theMove) {
              this.uiSet.currentMoveNumber++;
              // TODO: validar si es jaque mate para dar como correcto el ejercicio, sin importar el movimiento
              if (this.chessInstance.fen() === this.fenSolution[this.uiSet.currentMoveNumber]) {
                console.log('correct!!!');
                this.uiSet.allowBackMove = true;
                this.puzzleStatus = 'good';
                this.puzzleMoveResponse();
              } else {
                console.log('Wrong');
                this.puzzleStatus = 'wrong';
                this.isPuzzleCompleted = true;

                this.saveUserPuzzle();

                this.stopTimer();
              }

            }
            // return true, if input is accepted/valid, `false` takes the move back
            return theMove;
          case 'moveInputCanceled':
            // hide the indicators
            console.log('moveCanceled ', this.chessInstance.pgn());
            return true;
          default:
            return true;
        }
      });

    } else {
      // Ya el tablero fue cargado la primera vez
      this.board.setPosition(this.fenSolution[this.uiSet.currentMoveNumber], true);
    }



    this.turnRoundBoard(this.puzzleColor);
    this.puzzleMoveResponse();
    this.initTimer();
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
    this.board.setPosition(this.puzzleToResolve.fen, true);
    this.chessInstance.load(this.puzzleToResolve.fen);
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
   * @param isForViewSolution boolean:
   * Es utilizado para incrementar o no el currentMoveNumber (por defecto se incrementa)
   * isForViewSolution = true // detiene el incremento de currentMoveNumber
   * It is used to increase or not the currentmavenumber (default is increased)
   * isForViewSolution  = True // stops the increase of currentmavenumber
   */
  nextMove(isForViewSolution = false) {
    this.uiSet.allowBackMove = true;
    if (!isForViewSolution) {
      this.uiSet.currentMoveNumber++;
    }
    this.board.setPosition(this.fenSolution[this.uiSet.currentMoveNumber], true);
    this.chessInstance.load(this.fenSolution[this.uiSet.currentMoveNumber]);
    if (this.uiSet.currentMoveNumber === this.fenSolution.length - 1) {
      this.uiSet.allowNextMove = false;
    }

  }

  moveToEnd() {
    this.uiSet.allowBackMove = true;
    this.uiSet.allowNextMove = false;
    this.uiSet.currentMoveNumber = this.fenSolution.length - 1;
    this.board.setPosition(this.fenSolution[this.fenSolution.length - 1], true);
    this.chessInstance.load(this.fenSolution[this.fenSolution.length - 1]);
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
      console.log('completed');

      this.puzzleStatus = 'finished';
      this.isPuzzleCompleted = true;
      this.uiSet = { ...this.uiSet, allowNextPuzzle: true };
      this.saveUserPuzzle();
      this.stopTimer();
    } else {

      this.chessInstance.load(this.fenSolution[this.uiSet.currentMoveNumber]);
      const fen = this.chessInstance.fen();
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 200);
      });
      await this.board.setPosition(fen, true);
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
    // True is sent to identify that it is because it was requested to show the solution, and not add the currentMoveNumber
    // Se envía true para identificar que es porque se pidió mostrar la solución, y no sumar el currentMoveNumber

    // If you are resenting and requested the solution, if you must increase the number of play,
    // Because when reintenting a play automatically is delayed

    // si se esta reintentando y se pide mostrar la solución, si debe aumentar el número de jugada,
    // porque al reintentar se retrasa una jugada automáticamente

    const disableSumCurrentMoveNumber = this.puzzleStatus === 'isRetrying' ? false : true;

    this.nextMove(disableSumCurrentMoveNumber);

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
      currentEloUser: this.profile?.eloPuzzles || 1500,
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

    this.eloToShow = calculateElo(this.eloToShow, userPuzzle.eloPuzzle, userPuzzle.resolved).ra;
    this.eloLessSum = Math.abs(this.eloToShow - userPuzzle.currentEloUser);

    // Guarda el puzzle en la base de datos
    this.userPuzzlesService.saveUserPuzzle(userPuzzle);
  }


}

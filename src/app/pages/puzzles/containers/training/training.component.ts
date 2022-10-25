//core and third party libraries
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';


import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  SQUARE_SELECT_TYPE,
  Chessboard,
  BORDER_TYPE
} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';
import Chess from 'chess.js';
import { createUid } from '@utils/create-uid';
import { randomNumber } from '@utils/random-number';

// rxjs
import { interval, pipe, Subject, combineLatest, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


// states
import { PuzzlesState } from '@redux/states/puzzles.state';

// actions
import { requestLoadPuzzles } from '@redux/actions/puzzles.actions';

// selectors
import { getPuzzlesToResolve } from '@redux/selectors/puzzles.selectors';
import { getProfile } from '@redux/selectors/auth.selectors';


// models
import { Puzzle } from '@models/puzzle.model';
import { Profile } from '@models/profile.model';

interface UISettings {
  allowBackMove: boolean;
  allowNextMove: boolean;
  allowNextPuzzle: boolean;
  currentMoveNumber: number;
}

// services

// components


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
    currentMoveNumber: 0
  };

  profile: Profile;
  puzzlesAvailable: Puzzle[];


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
  puzzleStatus: 'start' | 'wrong' | 'good' | 'finished' | 'showSolution' = 'start';
  isPuzzleCompleted = false;


  // MOdificar esto a como esta en la libreria de lullalib
  private unsubscribe$ = new Subject<void>();
  private unsubscribeIntervalSeconds$ = new Subject<void>();

  constructor(
    private store: Store<PuzzlesState>
  ) {
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.initSubscribers();
  }


  configsStart() {
    this.time = 0;
    this.timeColor = 'success';
    this.uiSet = {
      allowBackMove: false,
      allowNextMove: false,
      allowNextPuzzle: false,
      currentMoveNumber: 0
    };
    this.puzzleStatus = 'start';
  }

  initSubscribers() {

    const puzzles$ = this.store.select(pipe(getPuzzlesToResolve()));
    const profile$ = this.store.pipe(select(getProfile));
    combineLatest([puzzles$, profile$]).subscribe((data) => {
      // TODO: implementar un control de seguridad para evitar que se produzca un loop infinito
      // podría ser un numero máximo de peticiones en un tiempo determinado
      this.profile = data[1];
      this.puzzlesAvailable = data[0];

      if (data[0].length === 0 && this.profile) {
        const action = requestLoadPuzzles({ eloStar: this.profile.elo - 600, eloEnd: this.profile.elo + 600 });
        this.store.dispatch(action);

      } else if (!this.puzzleToResolve && data[0].length > 0) {
        this.loadPuzzle();
      }

    });

  }


  loadPuzzle() {

    this.puzzleToResolve = this.puzzlesAvailable[Math.floor(Math.random() * this.puzzlesAvailable.length)];
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

    // Se carga el primer fen, para luego hacer el movimiento automático y que quede el efecto de tal movimiento
    this.chessInstance.load(this.puzzleToResolve.fen);

    // Se cambia el color por que luego se realizara automáticamente la jugada inicial de la maquina
    this.puzzleColor = this.chessInstance.turn() === 'b' ? 'w' : 'b';

    // Se valida si es la primera vez que se carga el tablero
    if (!this.board) {
      this.board = await new Chessboard(document.getElementById('boardPuzzle'), {
        position: this.puzzleToResolve.fen,
        style: {
          borderType: BORDER_TYPE.thin
        },
        sprite: { url: '/assets/images/chessboard-sprite-staunty.svg' }
      });

      this.board.enableMoveInput((event) => {
        // handle user input here
        switch (event.type) {
          case INPUT_EVENT_TYPE.moveStart:
            // console.log(`moveStart: ${event.square}`);
            // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
            return true;
          case INPUT_EVENT_TYPE.moveDone:

            const objectMove = { from: event.squareFrom, to: event.squareTo };
            const theMove = this.chessInstance.move(objectMove);

            if (theMove) {
              this.uiSet.currentMoveNumber++;

              if (this.chessInstance.fen() === this.fenSolution[this.uiSet.currentMoveNumber]) {
                console.log('correct!!!');
                this.uiSet.allowBackMove = true;
                this.puzzleStatus = 'good';
                this.puzzleMoveResponse();
              } else {
                console.log('Wrong');
                this.puzzleStatus = 'wrong';
                this.isPuzzleCompleted = true;
              }

            }
            // return true, if input is accepted/valid, `false` takes the move back
            return theMove;
          case INPUT_EVENT_TYPE.moveCanceled:
            console.log('moveCanceled ', this.chessInstance.pgn());
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

  backMove() {
    this.uiSet.currentMoveNumber--;
    this.uiSet.allowNextMove = true;
    this.board.setPosition(this.fenSolution[this.uiSet.currentMoveNumber], true);
    this.chessInstance.load(this.fenSolution[this.uiSet.currentMoveNumber]);
    if (this.uiSet.currentMoveNumber === 0) {
      this.uiSet.allowBackMove = false;
    }

  }

  nextMove() {
    this.uiSet.allowBackMove = true;
    this.uiSet.currentMoveNumber++;
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
    // FIXME: No parece mostrar el efecto en el orden correcto
    this.uiSet = { ...this.uiSet, allowNextPuzzle: true };
    this.puzzleStatus = 'showSolution';
    if (this.uiSet.currentMoveNumber < this.fenSolution.length - 1) {
      this.uiSet.allowNextMove = true;
    }
    this.nextMove();
    this.stopTimer();
  }

  nextPuzzle() {
    this.configsStart();
    this.loadPuzzle();
  }


}

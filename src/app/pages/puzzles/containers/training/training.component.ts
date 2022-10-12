//core and third party libraries
import { Component, OnInit } from '@angular/core';

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
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


// states

// actions

// selectors
import { getPuzzlesToResolve } from '@redux/selectors/puzzles.selectors';

// models
import { Puzzle } from '@models/puzzle.model';

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

  // timer
  time = 0;
  timeColor = 'success';
  subsSeconds;

  board;
  chessInstance = new Chess();

  allowNextPuzzle = false;

  puzzleToResolve: Puzzle;
  fenSolution: string[] = [];

  // puzzle status and info for user
  puzzleColor: 'b' | 'w' = 'w';
  puzzleStatus: 'start' | 'wrong' | 'good' | 'finished' | 'showSolution' = 'start';
  isPuzzleCompleted = false;


  private unsubscribe$ = new Subject<void>();
  private unsubscribeIntervalSeconds$ = new Subject<void>();

  constructor(
  ) {
    this.loadPuzzle();
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.loadBoard();
  }


  loadPuzzle() {
    this.puzzleToResolve = {
      uid: '00sHx',
      fen: 'q3k1nr/1pp1nQpp/3p4/1P2p3/4P3/B1PP1b2/B5PP/5K2 b k - 0 17',
      moves: 'e8d7 a2e6 d7d8 f7f8',
      rating: 1760,
      ratingDeviation: 80,
      popularity: 83,
      nbPlays: 72,
      randomNumberQuery: randomNumber(),
      themes: ['mate', 'mateIn2', 'middlegame', 'short'],
      gameUrl: 'https://lichess.org/yyznGmXs/black#34',
      openingFamily: 'Italian_Game',
      openingVariation: 'Italian_Game_Classical_Variation'
    };

    this.fenSolution = [];
    const chessInstance = new Chess(this.puzzleToResolve.fen);
    const movesArray = this.puzzleToResolve.moves.split(' ');

    this.fenSolution.push(chessInstance.fen());
    for (const move of movesArray) {
      chessInstance.move(move, { sloppy: true });
      const fen = chessInstance.fen();
      this.fenSolution.push(fen);
    }

  }


  async loadBoard() {
    if (!this.puzzleToResolve) {
      this.loadPuzzle();
    }
    this.chessInstance.load(this.puzzleToResolve.fen);
    this.puzzleColor = this.chessInstance.turn();

    this.board = await new Chessboard(document.getElementById('boardPuzzle'), {
      position: this.puzzleToResolve.fen,
      style: {
        borderType: BORDER_TYPE.thin
      },
      sprite: { url: '/assets/images/chessboard-sprite-staunty.svg' }
    });

    this.turnRoundBoard(this.puzzleColor);


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

    this.chessInstance.load(this.fenSolution[this.uiSet.currentMoveNumber]);
    const fen = this.chessInstance.fen();
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 200);
    });
    await this.board.setPosition(fen, true);

    console.log(this.uiSet.currentMoveNumber, this.fenSolution.length - 1);
    if (this.uiSet.currentMoveNumber === this.fenSolution.length - 1) {
      console.log('completed');

      this.puzzleStatus = 'finished';
      this.isPuzzleCompleted = true;
      this.allowNextPuzzle = true;
    }
  }


  showSolution() {
    this.allowNextPuzzle = true;
    this.puzzleStatus = 'showSolution';
    if (this.uiSet.currentMoveNumber < this.fenSolution.length - 1) {
      this.uiSet.allowNextMove = true;
    }
    this.nextMove();
    this.stopTimer();
  }

  nextPuzzle() {

  }


}

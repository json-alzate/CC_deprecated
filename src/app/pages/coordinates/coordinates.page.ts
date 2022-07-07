//core and third party libraries
import { Component, OnInit } from '@angular/core';
import Chess from 'chess.js';
import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  SQUARE_SELECT_TYPE,
  Chessboard,
  BORDER_TYPE
} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';

// rxjs
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


// states

// actions

// selectors

// models

// services

// components



@Component({
  selector: 'app-coordinates',
  templateUrl: './coordinates.page.html',
  styleUrls: ['./coordinates.page.scss'],
})
export class CoordinatesPage implements OnInit {

  letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
  board;

  subsSeconds;
  private unsubscribeIntervalSeconds$ = new Subject<void>();

  isPlaying = false;
  currentPuzzle = '';
  puzzles: string[] = [];

  score = 0;
  time = 60;
  timeColor: 'success' | 'warning' | 'danger' = 'success';

  // Options
  color: 'random' | 'white' | 'black' = 'random';


  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadBoard();
  }


  async loadBoard() {
    this.board = await new Chessboard(document.getElementById('boardCordinates'), {
      position: 'empty',
      style: {
        showCoordinates: false,
        borderType: BORDER_TYPE.thin
      },
      sprite: { url: '/assets/images/chessboard-sprite-staunty.svg' }
    });

    this.board.enableSquareSelect((event) => {
      switch (event.type) {
        case SQUARE_SELECT_TYPE.primary:

          if (this.isPlaying) {

            if (event.square === this.currentPuzzle) {
              this.nextPuzzle();
            } else {
              this.timeColor = 'danger';
            }

          }

        // left click
        case SQUARE_SELECT_TYPE.secondary:
        // right click
      }
    })



  }

  generatePuzzles(count = 1): string[] {
    const puzzles = [];

    for (let i = 0; i < count; i++) {
      const puzzle = `${this.letters[Math.floor(Math.random() * this.letters.length)]}${this.numbers[Math.floor(Math.random() * this.numbers.length)]}`;
      puzzles.push(puzzle);
    }

    return puzzles;
  }


  play() {
    this.puzzles = this.generatePuzzles(200);
    this.currentPuzzle = this.puzzles[0];
    this.isPlaying = true;
    this.initInterval();
  }


  initInterval() {

    if (!this.subsSeconds) {
      const seconds = interval(1000);
      this.subsSeconds = seconds.pipe(
        takeUntil(this.unsubscribeIntervalSeconds$)
      );

      this.subsSeconds.subscribe(() => {
        this.time = this.time - 1;
        if (this.time < 1) {
          this.stopGame();
        } else if (this.time > 15) {
          this.timeColor = 'success';
        } else {
          this.timeColor = 'warning';
        }
      });
    }

  }


  nextPuzzle() {
    this.score++;
    this.currentPuzzle = this.puzzles[this.score];
  }

  stopGame() {
    this.unsubscribeIntervalSeconds$.next();
    this.isPlaying = false;
  }

}

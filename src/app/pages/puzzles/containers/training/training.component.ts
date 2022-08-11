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

// rxjs

// states

// actions

// selectors

// models
import { Puzzle } from '@models/puzzle.model';

// services

// components


@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit {

  board;

  // TODO: only for test
  puzzleToResolve: Puzzle = {
    uid: '00sHx',
    fen: 'q3k1nr/1pp1nQpp/3p4/1P2p3/4P3/B1PP1b2/B5PP/5K2 b k - 0 17',
    moves: 'e8d7 a2e6 d7d8 f7f8',
    rating: 1760,
    ratingDeviation: 80,
    popularity: 83,
    nbPlays: 72,
    themes: ['mate', 'mateIn2', 'middlegame', 'short'],
    gameUrl: 'https://lichess.org/yyznGmXs/black#34',
    openingFamily: 'Italian_Game',
    openingVariation: 'Italian_Game_Classical_Variation'
  };

  constructor() { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.loadBoard();
  }


  async loadBoard(showCoordinates = false, position = 'empty') {
    this.board = await new Chessboard(document.getElementById('boardPuzzle'), {
      position: this.puzzleToResolve.fen,
      style: {
        showCoordinates,
        borderType: BORDER_TYPE.thin
      },
      sprite: { url: '/assets/images/chessboard-sprite-staunty.svg' }
    });

    this.board.enableSquareSelect((event) => {
      switch (event.type) {
        case SQUARE_SELECT_TYPE.primary:

          break;

        // left click
        case SQUARE_SELECT_TYPE.secondary:
          // right click

          break;
      }
    });

  }


}

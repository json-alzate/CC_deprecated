//core and third party libraries
import { Component, OnInit } from '@angular/core';
import Chess from 'chess.js';
import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  SQUARE_SELECT_TYPE,
  Chessboard
} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';

// rxjs

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


  board;

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadBoard();
  }


  async loadBoard() {
    this.board = await new Chessboard(document.getElementById('board1'), {
      position: 'empty',
      style: {
        showCoordinates: false
      },
      sprite: { url: '/assets/images/chessboard-sprite-staunty.svg' }
    });

    this.board.enableSquareSelect((event) => {
      switch (event.type) {
        case SQUARE_SELECT_TYPE.primary:
          console.log(event.square);

        // left click
        case SQUARE_SELECT_TYPE.secondary:
        // right click
      }
    })



  }

}

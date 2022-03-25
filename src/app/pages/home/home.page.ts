import { Component, OnInit } from '@angular/core';

import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  Chessboard
} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  board;

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.loadBoard();
  }

  async loadBoard() {
    this.board = await new Chessboard(document.getElementById('board1'), {
      position: 'start',
      style: {},
      sprite: { url: '/assets/images/chessboard-sprite-staunty.svg' }
    });
  }
}

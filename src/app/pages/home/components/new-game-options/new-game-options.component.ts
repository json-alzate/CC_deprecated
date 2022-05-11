// core and third party libraries
import { Component, OnInit } from '@angular/core';

// rxjs

// states

// actions

// selectors

// models

// services
import { SocketService } from '@services/sockt.service';

// components


@Component({
  selector: 'app-new-game-options',
  templateUrl: './new-game-options.component.html',
  styleUrls: ['./new-game-options.component.scss'],
})
export class NewGameOptionsComponent implements OnInit {

  time = 10.0;
  color: 'random' | 'white' | 'black' = 'random';
  segment: 'game' | 'lobby' = 'game';
  searchingGame = false;

  constructor(
  ) { }

  ngOnInit() { }

  segmentChanged(event: any) {

  }

  onPlay() {

    this.searchingGame = true;

  }

  onCancel() {
    this.searchingGame = false;
  }

}

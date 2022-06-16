//core and third party libraries
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

// rxjs

// states
import { getCurrentGameState, CurrentGameState } from '@redux/states/current-game.state';

// actions

// selectors


// models
import { Game } from '@models/game.model';

// services

// components

@Component({
  selector: 'app-end-game',
  templateUrl: './end-game.component.html',
  styleUrls: ['./end-game.component.scss'],
})
export class EndGameComponent implements OnInit {

  currentGame: Game;

  constructor(
    private store: Store<CurrentGameState>
  ) {
    this.store.pipe(select(getCurrentGameState)).subscribe(state => {
      this.currentGame = state.game;
    });
  }

  ngOnInit() { }

}

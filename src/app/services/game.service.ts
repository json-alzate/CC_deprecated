//core and third party libraries
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

// rxjs

// states
import { CurrentGameState } from '@redux/states/current-game.state';

// actions
import { setCurrentGame, setStatusCurrentGame } from '@redux/actions/current-game.actions';

// selectors

// models
import { Game } from '@models/game.model';
import { Game as GameSocket } from '@models/sockets.model';

// services

// components

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private store: Store<CurrentGameState>
  ) { }

  startGameFromSocket(gameSocket: GameSocket, uidUser?: string) {

    const game: Game = {
      uid: gameSocket.uid,
      playerBlack: gameSocket.black,
      uidUserBlack: gameSocket.uidUserBlack,
      uidUserWhite: gameSocket.uidUserWhite,
      playerWhite: gameSocket.white,
      createAt: gameSocket.createAt,
      moves: [],
      movesFen: [],
      movesHumanHistoryRow: [],
      pgn: '',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      timeControl: gameSocket.timeControl,
      orientation: uidUser === gameSocket.uidUserBlack ? 'black' : 'white'
    };

    this.setCurrentGame(game);
    this.setStatusCurrentGame('playing');

  }

  private setCurrentGame(game: Game) {
    const action = setCurrentGame({ game });
    this.store.dispatch(action);
  }

  private setStatusCurrentGame(status: "loading" | "playing" | "error") {
    const action = setStatusCurrentGame({ status });
    this.store.dispatch(action);
  }

}

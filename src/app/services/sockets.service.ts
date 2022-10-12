import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Socket } from 'ngx-socket-io';
// core and third party libraries

// rxjs
import { Subject } from 'rxjs';


// states
import { CurrentGameState, StatusCurrentGame } from '@redux/states/current-game.state';

// actions
import { cancelCurrentGame } from '@redux/actions/current-game.actions';

// selectors
import { getCurrentGame } from '@redux/selectors/current-game.selectors';

// models
import { UserRequestToPlay, Game as GameSocket, EndGame } from '@models/sockets.model';
import { Move, Game } from '@models/game.model';

// services
import { GameService } from '@services/game.service';
import { MovesService } from '@services/moves.service';

// components


@Injectable({
  providedIn: 'root'
})
export class SocketsService {


  private readyListenMatchGame: boolean = false;

  private uidUser: string;

  uidsGamesToListenMoves: string[] = [];

  currentGame: Game;

  constructor(
    private socket: Socket,
    private gameService: GameService,
    private movesService: MovesService,
    private store: Store<CurrentGameState>
  ) {

    // TODO: habilitar socket
    // this.listenCurrentGame();

  }

  listenCurrentGame() {

    this.store.select(getCurrentGame).subscribe(currentGame => {
      this.currentGame = currentGame;
    });

  }


  startConnection() {
    this.socket.connect();
    this.listenCancelGame();
    this.listenMoves();
  }

  // Match Engine
  sendRequestNewGame(requestNewGame: UserRequestToPlay) {
    this.socket.emit('1_in_matchEngine_requestGame', requestNewGame);
    this.uidUser = requestNewGame.uidUser;
  }

  listenMatchGame() {
    if (!this.readyListenMatchGame) {

      this.socket.fromEvent('2_out_matchEngine_readyMatch').subscribe((match: GameSocket) => {
        console.log('tenemos match!', match);
        this.readyListenMatchGame = true;
        this.uidsGamesToListenMoves.push(match.uid);
        this.gameService.startGameFromSocket(match, this.uidUser);
      });

    }
  }


  // Game
  listenCancelGame() {

    this.socket.fromEvent('6_out_game_end').subscribe((endGame: EndGame) => {

      if (endGame?.uid === this.currentGame?.uid) {
        console.log('endGame', endGame);

        const action = cancelCurrentGame({ cancelReason: endGame.motive });
        this.store.dispatch(action);
      }

    });

  }

  // Moves
  sendMove(move: Move) {
    this.socket.emit('3_in_game_move', move);
  }

  /**
   * Escucha y adiciona los movimientos según los uids de los juegos que se están jugando
   */
  listenMoves() {

    this.socket.fromEvent('4_out_game_move').subscribe((move: any) => {
      console.log('move', move);
      const find = this.uidsGamesToListenMoves.find(uid => uid === move.uidGame);
      if (find) {
        this.movesService.addMoveFromSocket(move);
      }
    });

  }



}

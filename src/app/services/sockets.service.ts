import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
// core and third party libraries

// rxjs
import { Subject } from 'rxjs';


// states

// actions

// selectors

// models
import { UserRequestToPlay, Game } from '@models/sockets.model';
import { Move } from '@models/game.model';

// services
import { GameService } from '@services/game.service';
import { MovesService } from '@services/moves.service';

// components


@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  matchGame$ = new Subject<Game>();

  private readyListenMatchGame: boolean = false;

  private uidUser: string;

  uidsGamesToListenMoves: string[] = [];

  constructor(
    private socket: Socket,
    private gameService: GameService,
    private movesService: MovesService
  ) { }

  startConnection() {
    this.socket.connect();
    this.listenMoves();
  }


  sendRequestNewGame(requestNewGame: UserRequestToPlay) {
    this.socket.emit('1_in_matchEngine_requestGame', requestNewGame);
    this.uidUser = requestNewGame.uidUser;
  }

  listenMatchGame() {
    if (!this.readyListenMatchGame) {

      this.socket.fromEvent('2_out_matchEngine_readyMatch').subscribe((match: Game) => {
        console.log('tenemos match!', match);
        this.readyListenMatchGame = true;
        this.uidsGamesToListenMoves.push(match.uid);
        this.gameService.startGameFromSocket(match, this.uidUser);
        this.matchGame$.next(match);
      });

    }
  }

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

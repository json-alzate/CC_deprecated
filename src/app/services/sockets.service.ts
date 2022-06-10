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

// services
import { GameService } from '@services/game.service';

// components


@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  matchGame$ = new Subject<Game>();

  private readyListenMatchGame: boolean = false;

  private uidUser: string;

  constructor(
    private socket: Socket,
    private gameService: GameService
  ) { }


  sendRequestNewGame(requestNewGame: UserRequestToPlay) {
    this.socket.emit('1_in_matchEngine_requestGame', requestNewGame);
    this.uidUser = requestNewGame.uidUser;
  }

  listenMatchGame() {
    if (!this.readyListenMatchGame) {

      this.socket.fromEvent('2_out_matchEngine_readyMatch').subscribe((match: Game) => {
        console.log('tenemos match!', match);
        this.readyListenMatchGame = true;
        this.gameService.startGameFromSocket(match, this.uidUser);
        this.matchGame$.next(match);
      });

    }
  }



}

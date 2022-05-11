import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
// core and third party libraries

// rxjs
import { Subject } from 'rxjs';


// states

// actions

// selectors

// models
import { RequestNewGame } from '@models/sockets.model';

// services

// components


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  matchGame$ = new Subject<any>();

  constructor(
    private socket: Socket
  ) { }


  sendRequestNewGame(requestNewGame: RequestNewGame) {
    this.socket.emit('1_in_matchEngine_requestGame', requestNewGame);
  }

  listenMatchGame(){
    // TODO: crear modelo de juego match
    this.socket.fromEvent('2_out_matchEngine_readyMatch').subscribe((match) => {
      this.matchGame$.next(match);
    });
  }



}

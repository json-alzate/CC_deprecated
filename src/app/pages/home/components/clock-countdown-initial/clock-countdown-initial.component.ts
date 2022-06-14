import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { OutClockUpdate } from '@models/sockets.model';
import { Game } from '@models/game.model';

@Component({
  selector: 'app-clock-countdown-initial',
  templateUrl: './clock-countdown-initial.component.html',
  styleUrls: ['./clock-countdown-initial.component.scss'],
})
export class ClockCountdownInitialComponent implements OnInit {

  timer: number = 20;
  messageColor: 'white' | 'black' = 'white';
  game: Game;


  @Input()
  set setGame(game: Game) {
    if (game?.uid) {
      this.game = game;
      this.listenSocketCountDown();
    }
  }

  @Input()
  set setColorForTimer(color: 'white' | 'black') {
    this.messageColor = color;
  }

  constructor(
    private socket: Socket
  ) { }

  ngOnInit() { }

  listenSocketCountDown() {
    this.socket.fromEvent('5_out_clock_update').subscribe((clockUpdate: OutClockUpdate) => {
      if (clockUpdate?.uid === this.game?.uid && clockUpdate?.type === 'whiteCountDown') {
        this.timer = clockUpdate.time;
      }
    });
  }



}

import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { OutClockUpdate } from '@models/sockets.model';
import { Game } from '@models/game.model';

@Component({
  selector: 'app-clock-countdown-initial',
  templateUrl: './clock-countdown-initial.component.html',
  styleUrls: ['./clock-countdown-initial.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockCountdownInitialComponent implements OnInit {

  timer: number = 20;
  game: Game;

  message = '';
  sideOfCountDown: 'bottom' | 'top' = 'bottom';


  @Input()
  set setGame(game: Game) {
    if (game?.uid) {
      this.game = game;
      this.listenSocketCountDown();
    }
  }


  constructor(
    private socket: Socket,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  listenSocketCountDown() {
    // TODO: habilitar socket
    // this.socket.fromEvent('5_out_clock_update').subscribe((clockUpdate: OutClockUpdate) => {
    //   if (clockUpdate?.uid === this.game?.uid && (clockUpdate?.type === 'whiteCountDown' || clockUpdate?.type === 'blackCountDown')) {
    //     this.timer = clockUpdate.time;

    //     if (clockUpdate.type === 'whiteCountDown') {

    //       if (this.game?.playerWhite?.uidUser === this.game?.uidCurrentUser) {
    //         this.bottom();
    //       } else {
    //         this.top();
    //       }

    //     } else {
    //       if (this.game?.playerBlack?.uidUser === this.game?.uidCurrentUser) {
    //         this.bottom();
    //       } else {
    //         this.top();
    //       }
    //     }

    //   }
    //   this.changeDetectorRef.markForCheck();
    // });
  }

  bottom() {
    this.sideOfCountDown = 'bottom';
    this.message = 'Tu turno...';
  }

  top() {
    this.sideOfCountDown = 'top';
    this.message = 'Esperando al oponente';
  }



}

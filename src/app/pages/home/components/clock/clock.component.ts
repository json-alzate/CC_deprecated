import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import { OutClockUpdate } from '@models/sockets.model';


@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockComponent implements OnInit {

  isActive = false;
  time = 600000;

  @Input()
  set setActive(data: boolean) {
    this.isActive = data;
  }

  @Input()
  set setTime(data: number) {
    this.time = data;
  }

  /**
      data : {
        color: 'white' | 'black';
        uidGame: string;
        time: number; //  tiempo inicial (tiempo total del juego)
      }
   */
  @Input()
  set initListenSocket(data) {
    this.time = data.time;
    this.socket.fromEvent('5_out_clock_update').subscribe((clockUpdate: OutClockUpdate) => {
      if (clockUpdate.uid === data.uidGame && data.color === clockUpdate.type) {
        this.time = clockUpdate.time;
      }

      if (data.color === clockUpdate.type) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
      this.changeDetectorRef.markForCheck();
    });
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private socket: Socket
  ) {
    // TODO: listen timer socket
  }

  ngOnInit() { }

}

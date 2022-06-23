import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockComponent implements OnInit {

  isActive: boolean = false;
  time: number = 60000;


  @Input()
  set initListenSocket(data) {
    console.log('initListenSocket', data);

    this.socket.fromEvent('5_out_clock_update').subscribe((clockUpdate: any) => {
      // console.log('clockUpdate', clockUpdate);

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

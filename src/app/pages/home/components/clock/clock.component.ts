import { Component, OnInit, Input } from '@angular/core';

import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements OnInit {

  isActive: boolean = false;


  @Input()
  set initListenSocket(data) {
    console.log('initListenSocket', data);

    this.socket.fromEvent('5_out_clock_update').subscribe((clockUpdate: any) => {
      // console.log('clockUpdate', clockUpdate);

    });
  }

  constructor(
    private socket: Socket
  ) {
    // TODO: listen timer socket
  }

  ngOnInit() { }

}

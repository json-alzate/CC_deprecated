import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements OnInit {

  isActive: boolean = false;

  constructor() {
    // TODO: listen timer socket
   }

  ngOnInit() {}

}

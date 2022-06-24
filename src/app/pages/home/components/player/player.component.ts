
// core and third party libraries
import { Component, OnInit, Input } from '@angular/core';

// rxjs

// states

// actions

// selectors

// models
import { UserRequestToPlay } from '@models/sockets.model';

// services

// components


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {


  @Input() player: UserRequestToPlay;

  constructor() { }

  ngOnInit() {}

}

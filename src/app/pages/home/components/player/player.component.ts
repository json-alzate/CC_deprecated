
// core and third party libraries
import { Component, OnInit, Input } from '@angular/core';

// rxjs

// states

// actions

// selectors

// models
import { User } from '@models/user.model';

// services

// components


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {


  @Input() player: User;
  @Input() color: 'white' | 'black';

  constructor() { }

  ngOnInit() {}

}

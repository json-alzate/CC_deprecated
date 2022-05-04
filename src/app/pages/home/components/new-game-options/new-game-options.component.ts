import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-game-options',
  templateUrl: './new-game-options.component.html',
  styleUrls: ['./new-game-options.component.scss'],
})
export class NewGameOptionsComponent implements OnInit {

  time = 10.0;
  color: 'random' | 'white' | 'black' = 'random';
  segment: 'game' | 'lobby' = 'game'

  constructor() { }

  ngOnInit() { }

  segmentChanged(event: any) {

  }

  onPlay() {

  }

}

import { Injectable } from '@angular/core';

import { Howl, Howler } from 'howler';


@Injectable({
  providedIn: 'root'
})
export class SoundsService {

  select;
  error;

  constructor() {
    this.loadSounds();
  }

  loadSounds() {
    this.select = new Howl({
      src: ['assets/sounds/standard/Select.mp3']
    });
    this.error = new Howl({
      src: ['assets/sounds/standard/Error.mp3']
    });
  }


  playSelect() {
    this.select.play();
  }

  playError() {
    this.error.play();
  }

}

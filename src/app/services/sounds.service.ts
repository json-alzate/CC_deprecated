import { Injectable } from '@angular/core';

import { Howl, Howler } from 'howler';


@Injectable({
  providedIn: 'root'
})
export class SoundsService {

  select;
  error;
  move;
  capture;
  check;
  checkMate;

  constructor() {
    this.loadSounds();
  }

  loadSounds() {

    const basePath = 'assets/sounds/lisp/';

    this.select = new Howl({
      src: [basePath + 'Select.mp3']
    });
    this.error = new Howl({
      src: [basePath + 'Error.mp3']
    });
    this.move = new Howl({
      src: [basePath + 'Move.mp3']
    });
    this.capture = new Howl({
      src: [basePath + 'Capture.mp3']
    });
    this.check = new Howl({
      src: [basePath + 'Check.mp3']
    });
    this.checkMate = new Howl({
      src: [basePath + 'Victory.mp3']
    });

  }

  playMoveSound() {
    this.move.play();
  }

  playCaptureSound() {
    this.capture.play();
  }

  playCheckSound() {
    this.check.play();
  }

  playCheckmateSound() {
    this.checkMate.play();
  }



  playSelect() {
    this.select.play();
  }

  playError() {
    this.error.play();
  }

}

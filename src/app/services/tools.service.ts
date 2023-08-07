import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Chess from 'chess.js';

type ChessMoveType = 'castle' | 'check' | 'checkmate' | 'move' | 'capture';


import { Flag } from '@models/tools.models';

import { SoundsService } from '@services/sounds.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  flags: Flag[] = [];

  constructor(
    private httpClient: HttpClient,
    private soundsService: SoundsService
  ) { }

  /**
   * Carga lar referencias para utilizar las banderas
   */
  loadFlags() {
    this.httpClient.get<Flag[]>('/assets/data/flags.json').subscribe(flags => this.flags = flags);
  }

  /**
   * Valida el tipo de movimiento entre dos FEN
   */
  determineChessMoveType(previousFen: string, currentFen: string, playSound = true): ChessMoveType {
    const chess = new Chess(previousFen);
    const legalMoves = chess.moves({ verbose: true });

    // let toReturn: ChessMoveType = 'move';

    for (const move of legalMoves) {

      chess.move(move);
      if (chess.fen() === currentFen) {
        console.log('move ', move);
        if (chess.in_checkmate()) {
          if (playSound) {
            this.soundsService.playCheckmateSound();
          }
          console.log('checkmate');
          return 'checkmate';
        }
        if (chess.in_check()) {
          if (playSound) {
            this.soundsService.playCheckSound();
          }
          console.log('check');
          return 'check';
        }
        if (move.flags.includes('k') || move.flags.includes('q')) {
          if (playSound) {
            this.soundsService.playCastleSound();
          }
          console.log('castle');
          return 'castle';
        }
        if (move.flags.includes('c') || move.flags.includes('e')) {
          if (playSound) {
            this.soundsService.playCaptureSound();
          }
          console.log('capture');
          return 'capture';
        }

      }

      chess.undo();
    }

    if (playSound) {
      console.log('move');

      this.soundsService.playMoveSound();
    }

    return 'move';
  }




}

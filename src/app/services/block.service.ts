import { Injectable } from '@angular/core';

import { Puzzle, PuzzleQueryOptions } from '../models/puzzle.model';
import { Block } from '../models/plan.model';
import { Profile } from '@models/profile.model';

import { PuzzlesService } from '@services/puzzles.service';
import { ProfileService } from '@services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor(
    private puzzlesService: PuzzlesService,
    private profileService: ProfileService
  ) { }

  async generateBlockOfPuzzles(blockSettings: Block): Promise<Puzzle[]> {

    const options: PuzzleQueryOptions = {
      rangeStart: blockSettings.eloStart,
      rangeEnd: blockSettings.eloEnd,
      themes: blockSettings.themes,
      openingFamily: blockSettings.openingFamily
    };

    if (blockSettings.color !== 'random') {
      options.color = blockSettings.color === 'white' ? 'w' : 'b';
    }

    const puzzlesToAdd: Puzzle[] = await this.puzzlesService.loadMorePuzzles(-1, options, 'return');

    let puzzles: Puzzle[] = [];

    if (blockSettings.puzzles) {
      puzzles = [...blockSettings.puzzles, ...puzzlesToAdd];
    } else {
      puzzles = puzzlesToAdd;
    }

    return puzzles;

  }

  async generateBlocksForPlan(option: number): Promise<Block[]> {

    return new Promise((resolve, reject) => {

      const profile: Profile = this.profileService.getProfile;
      const defaultEloStart = 800;
      const defaultElo = 1500;

      // Nota: si el tiempo del puzzle es mayor que el tiempo del bloque, el tiempo restante
      // para el puzzle se convierte en el tiempo restante del bloque

      switch (option) {
        case 0: // Calentamiento / un mismo color
          //  2 minutos de mates en 1 (elo - 500) / tiempo por puzzle = 10 segundos
          //  1 minuto de mates en 2 / tiempo por puzzle = 10 segundos
          // 1 ejercicio de mate
          const mateIn1Elo = profile?.elos?.warmup['mateIn1'];
          const blocks: Block[] = [
            {
              time: 120,
              puzzlesCount: 0,
              themes: ['mateIn1'],
              eloStart: mateIn1Elo ? mateIn1Elo - 600 : defaultEloStart,
              eloEnd: (mateIn1Elo ?? defaultElo) - 500,
              color: 'random',
              puzzleTime: 10
            },
            {
              time: 60,
              puzzlesCount: 6,
              themes: ['mate'],
              eloStart: 500,
              eloEnd: 500,
              color: 'random',
              puzzleTime: 10
            },
            {
              time: 60,
              puzzlesCount: 1,
              themes: ['mate'],
              eloStart: 500,
              eloEnd: 500,
              color: 'random',
              puzzleTime: 60
            }
          ];
          break;
        case 5:
          /* No Muestra soluciones / un mismo color
              - tema random = t 2.5 minutos / 15 segundos por puzzle
              - tema debilidades (elo - 200) = t 2.5 minutos / 30 segundos por puzzle
          */
          break;
        case 10:

          /** No Muestra soluciones / un mismo color
           * - tema random || debilidades = t 2 minutos / 15 segundos por puzzle (elo - 100)
           * - apertura random || apertura débil = t 2 minutos / 30 segundos por puzzle
           * - misma apertura + mismo tema random = t 3 minutos / 60 segundos por puzzle
           * - mismo tema random = t 1 minuto / 20 segundos por puzzle
           * - misma apertura + finales = t 2 minutos / 60 segundos por puzzle
           */

          break;
        case 20:
          /** Muestra soluciones / cambio de color
           * - debilidades = t 3 minutos / 40 segundos por puzzle (elo - 500)
           * - tema random = t 5 minutos / 3 minutos por puzzle
           * - mate en 1 = t 2 minutos / 30 segundos por puzzle
           * - mismo tema random = t 2 minutos / 50 segundos por puzzle (elo - 300)
           * - mismo tema random = t 2 minuto / 50 segundos por puzzle (elo + 200)
           * - mismo tema random = t 1 minuto / 15 segundos por puzzle (elo - 800)
           *    ||  mismo tema random a ciegas 10 segundos = t 1 minuto / 60 segundos por puzzle
           * - finales = t 3 minutos / 60 segundos por puzzle
           * - mate 3 = t 2 minutos / 60 segundos por puzzle
           * */

          break;
        case 30:
          /** Muestra soluciones / un mismo color
           * - debilidades = t 5 minutos / 60 segundos por puzzle (elo - 200)
           * - apertura random = t 2 minutos / 30 segundos por puzzle
           * - tema random = t 5 minutos / 3 minutos por puzzle
           * - mismo tema random  a ciegas 15 segundos = t 5 minutos / 50 segundos por puzzle (elo - 300)
           * - finales = t 5 minutos / 60 segundos por puzzle
           * - finales de peones = t 5 minutos / 3 minutos por puzzle
           * - mate 4 o mas = t 2 minutos / 60 segundos por puzzle
           * */

          break;
        case -1:
          /**
           * Muestra soluciones / un mismo color
           * Vuelta a la calma
           * - 3 ejercicios de mates (elo : de 800 a 1000)
           * - 3 ejercicios de mates en 2 (elo : de 800 a 1000)
           * - 3 ejercicios de mates en 1 (elo : de 800 a 1000)
           */
          break;
        default:
          break;
      }

    });
  }



}

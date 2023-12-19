import { Injectable } from '@angular/core';

import { Puzzle, PuzzleQueryOptions } from '../models/puzzle.model';
import { Block } from '../models/plan.model';

import { PuzzlesService } from '@services/puzzles.service';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor(
    private puzzlesService: PuzzlesService
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

      switch (option) {
        case 0: // Calentamiento
          //  2 minutos de mates en 1 (elo - 500) / tiempo por puzzle = 10 segundos
          //  1 minuto de mates en 2 / tiempo por puzzle = 10 segundos
          // 1 ejercicio de mate
          break;
        case 5:
          /*
              - tema random = t 2.5 minutos / 15 segundos por puzzle
              - tema debilidades (elo - 200) = t 2.5 minutos / 30 segundos por puzzle
          */
          break;
        case 10:

          /**
           * - tema random || debilidades = t 2 minutos / 15 segundos por puzzle (elo - 100)
           * - apertura random || apertura débil = t 2 minutos / 30 segundos por puzzle
           * - misma apertura + mismo tema random = t 3 minutos / 60 segundos por puzzle
           * - mismo tema random = t 1 minuto / 20 segundos por puzzle
           * - misma apertura + finales = t 2 minutos / 60 segundos por puzzle
           */

          break;
        case 20:

          break;
        case 30:

          break;
        default:
          break;
      }

    });
  }



}

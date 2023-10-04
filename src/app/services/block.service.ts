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

  async generateBlockOfPuzzles(blockSettings: Block): Promise<Block> {

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

    return {
      ...blockSettings,
      puzzles
    };

  }
}

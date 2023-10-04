import { Component, OnInit } from '@angular/core';

import { Puzzle } from '@models/puzzle.model';
import { UserPuzzle } from '@models/user-puzzles.model';
import { Block } from '@models/plan.model';


import { BlockService } from '@services/block.service';


@Component({
  selector: 'app-block-training',
  templateUrl: './block-training.component.html',
  styleUrls: ['./block-training.component.scss'],
})
export class BlockTrainingComponent implements OnInit {

  puzzleToPlay: Puzzle;
  block: Block;

  constructor(
    private blockService: BlockService
  ) { }

  ngOnInit() { }

  async onCreateBlock(newBlock: Block) {
    const puzzles = await this.blockService.generateBlockOfPuzzles(newBlock);
    this.block = { ...newBlock, puzzles, puzzlesPlayed: [] };
    this.selectPuzzleToPlay();
  }


  selectPuzzleToPlay() {
    // busca un puzzle del bloque que no haya sido resuelto
    // eslint-disable-next-line max-len
    this.puzzleToPlay = this.block.puzzles.find(puzzle => !this.block.puzzlesPlayed.find(puzzlePlayed => puzzlePlayed.uidPuzzle === puzzle.uid));
    console.log('puzzleToPlay', this.puzzleToPlay);

  }

  onPuzzleCompleted(puzzleCompleted: UserPuzzle) {
    console.log('puzzleCompleted', puzzleCompleted);
    // TODO: calcular elo
    this.block.puzzlesPlayed.push(puzzleCompleted);

    // valida si se completo el numero de puzzles del bloque (si se definió un numero de puzzles)
    if (this.block.puzzlesCount > 0 && this.block.puzzlesPlayed.length >= this.block.puzzlesCount) {
      this.finishBlock();
      return;
    }

    this.selectPuzzleToPlay();
  }

  finishBlock() {
    console.log('block finished');
  }

}

import { Component, OnInit } from '@angular/core';

import { createUid } from '@utils/create-uid';

import { Puzzle } from '@models/puzzle.model';
import { UserPuzzle } from '@models/user-puzzles.model';
import { Block } from '@models/plan.model';
import { Profile } from '@models/profile.model';



import { BlockService } from '@services/block.service';


@Component({
  selector: 'app-block-training',
  templateUrl: './block-training.component.html',
  styleUrls: ['./block-training.component.scss'],
})
export class BlockTrainingComponent implements OnInit {

  puzzleToPlay: Puzzle = {
    gameUrl: 'https://lichess.org/x79ejp2U/black#42',
    popularity: 93,
    openingFamily: '\r',
    themes: [
      'crushing',
      'fork',
      'middlegame',
      'short'
    ],
    rating: 1654,
    fen: '2r3k1/R4ppp/1p1p1b2/1B1rpq2/P7/1P6/4QPPP/5RK1 b - - 0 21',
    ratingDeviation: 75,
    randomNumberQuery: 3182,
    uid: '07FQY',
    nbPlays: 6011,
    openingVariation: '',
    moves: 'h7h6 b5d7 f5d3 e2d3',
    goshPuzzleTime: 5,
    times: {
      dangerOn: 15,
      total: 60,
      warningOn: 30
    }
  };
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
    this.puzzleToPlay = {
      ...this.block.puzzles.find(puzzle => !this.block.puzzlesPlayed.find(puzzlePlayed => puzzlePlayed.uidPuzzle === puzzle.uid)),
      goshPuzzleTime: this.block.goshPuzzleTime
    };
    console.log('puzzleToPlay', this.puzzleToPlay);

  }

  onPuzzleCompleted(puzzleCompleted: Puzzle, puzzleStatus: 'good' | 'bad') {
    console.log('puzzleCompleted', puzzleCompleted);
    // TODO: calcular elo

    const userPuzzle: UserPuzzle = {
      uid: createUid(),
      date: new Date().getTime(),
      resolvedTime: puzzleCompleted.timeUsed,
      uidUser: '',
      currentEloUser: 1500,
      uidPuzzle: puzzleCompleted.uid,
      resolved: puzzleStatus === 'good' ? true : false,
      eloPuzzle: puzzleCompleted.rating,
      themes: puzzleCompleted.themes,
      openingFamily: puzzleCompleted.openingFamily,
      openingVariation: puzzleCompleted.openingVariation
    };
    this.block.puzzlesPlayed.push(userPuzzle);
    // valida si se completo el numero de puzzles del bloque (si se definió un numero de puzzles)
    if (this.block.puzzlesCount > 0 && this.block.puzzlesPlayed.length >= this.block.puzzlesCount) {
      this.finishBlock();
    } else {
      this.selectPuzzleToPlay();
    }
  }

  finishBlock() {
    console.log('block finished');
  }

}

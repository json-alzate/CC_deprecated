import { Component, OnInit } from '@angular/core';

import { Block } from '@models/plan.model';


import { BlockService } from '@services/block.service';


@Component({
  selector: 'app-block-training',
  templateUrl: './block-training.component.html',
  styleUrls: ['./block-training.component.scss'],
})
export class BlockTrainingComponent implements OnInit {

  constructor(
    private blockService: BlockService
  ) { }

  ngOnInit() { }

  async onCreateBlock(newBlock: Block) {

    const block = await this.blockService.generateBlockOfPuzzles(newBlock);
    console.log('bloque para tocar', block);
  }

}

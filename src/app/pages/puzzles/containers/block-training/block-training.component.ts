import { Component, OnInit } from '@angular/core';

import { Block } from '@models/plan.model';


@Component({
  selector: 'app-block-training',
  templateUrl: './block-training.component.html',
  styleUrls: ['./block-training.component.scss'],
})
export class BlockTrainingComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  onCreateBlock(newBlock: Block) {
    console.log(newBlock);
  }

}

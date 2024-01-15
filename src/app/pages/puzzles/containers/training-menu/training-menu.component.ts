import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Plan, Block } from '@models/plan.model';
import { PlanService } from '@services/plan.service';
import { BlockService } from '@services/block.service';
import { PuzzlesService } from '@services/puzzles.service';

@Component({
  selector: 'app-training-menu',
  templateUrl: './training-menu.component.html',
  styleUrls: ['./training-menu.component.scss'],
})
export class TrainingMenuComponent implements OnInit {


  constructor(
    private navController: NavController,
    private planService: PlanService,
    private blockService: BlockService,
    private puzzlesService: PuzzlesService
  ) { }

  ngOnInit() {
    // this.puzzlesService.getTotalPuzzlesInDB().then((total) => {
    //   console.log('Total puzzles', total);
    // }
    // );

  }

  async createPlan(option: number) {


    const blocks: Block[] = await this.blockService.generateBlocksForPlan(option);

    console.log('No puzzles', blocks);
    // se recorre cada bloque para generar los puzzles
    for (const block of blocks) {
      block.puzzles = await this.blockService.generateBlockOfPuzzles(block);
    }

    console.log(blocks);

    const newPlan: Plan = await this.planService.newPlan(blocks);

  }

  goTo(path: string) {
    this.navController.navigateForward(path);
  }

}

/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';

import { ModalController, NavController } from '@ionic/angular';

import { Plan } from '@models/plan.model';
import { Puzzle } from '@models/puzzle.model';

import { AppService } from '@services/app.service';
import { PlanService } from '@services/plan.service';

import { PuzzleSolutionComponent } from '@pages/puzzles/components/puzzle-solution/puzzle-solution.component';



@Component({
  selector: 'app-plan-played',
  templateUrl: './plan-played.component.html',
  styleUrls: ['./plan-played.component.scss'],
})
export class PlanPlayedComponent implements OnInit {

  plan: Plan;

  valueAccordionGroup: string[] = [];

  constructor(
    public appService: AppService,
    private planService: PlanService,
    private modalController: ModalController,
    private navController: NavController,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.planService.getPlan().then((plan: Plan) => {
      if (!plan) {
        this.navController.navigateRoot('/puzzles/training-menu');
        return;
      }
      this.plan = plan;
      this.setValuesAccordionGroup();
      console.log('Plan ', JSON.stringify(this.plan));
    });
  }

  setValuesAccordionGroup() {
    this.valueAccordionGroup = this.plan.blocks.map((_, i) => this.plan.uid + i);
  }

  async onPuzzleShowSolution(puzzle: Puzzle) {

    const modal = await this.modalController.create({
      component: PuzzleSolutionComponent,
      componentProps: {
        puzzle
      }
    });
    await modal.present();
  }

}

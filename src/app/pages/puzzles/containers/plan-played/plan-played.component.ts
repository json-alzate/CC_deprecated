/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';

import { ModalController, NavController } from '@ionic/angular';

import { Plan } from '@models/plan.model';
import { Puzzle } from '@models/puzzle.model';
import { UserPuzzle } from '@models/user-puzzles.model';

import { AppService } from '@services/app.service';
import { PlanService } from '@services/plan.service';
import { ProfileService } from '@services/profile.service';
import { PlansElosService } from '@services/plans-elos.service';

import { PuzzleSolutionComponent } from '@pages/puzzles/components/puzzle-solution/puzzle-solution.component';



@Component({
  selector: 'app-plan-played',
  templateUrl: './plan-played.component.html',
  styleUrls: ['./plan-played.component.scss'],
})
export class PlanPlayedComponent implements OnInit {

  plan: Plan;

  puzzlesPerPage = 4;
  showMoreButtons: { [blockIndex: number]: boolean } = {};
  userPuzzlesToShowInBoards: { [blockIndex: number]: UserPuzzle[] } = {};

  eloTotal: number;

  constructor(
    public appService: AppService,
    private planService: PlanService,
    private modalController: ModalController,
    private navController: NavController,
    private profileService: ProfileService,
    private plansElosService: PlansElosService
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.planService.getPlan().then((plan: Plan) => {
      if (!plan) {
        this.navController.navigateRoot('/puzzles/training-menu');
        return;
      }
      this.plan = plan;
      this.getTotalElo();
      this.plan.blocks.forEach((block, blockIndex) => {
        // Inicialmente carga 5 tableros por bloque
        this.userPuzzlesToShowInBoards[blockIndex] = block.puzzlesPlayed.slice(0, this.puzzlesPerPage);
        this.showMoreButtons[blockIndex] = block.puzzlesPlayed.length > this.puzzlesPerPage;
      });
    });
  }

  async getTotalElo() {
    if (this.plan.planType === 'custom') {
      this.eloTotal = (await this.plansElosService.getOnePlanElo(this.plan.uidCustomPlan))?.total || 0;
    } else {
      this.eloTotal = this.profileService.getProfile?.elos[this.plan.planType + 'Total'];
    }
  }

  loadMorePuzzles(blockIndex: number) {
    const block = this.plan.blocks[blockIndex];
    const currentCount = this.userPuzzlesToShowInBoards[blockIndex].length;
    // Añadir 5 más tableros
    const nextPuzzles = block.puzzlesPlayed.slice(currentCount, currentCount + this.puzzlesPerPage);
    this.userPuzzlesToShowInBoards[blockIndex] = [
      ...this.userPuzzlesToShowInBoards[blockIndex],
      ...nextPuzzles
    ];

    // Ocultar el botón si ya se han cargado todos los tableros
    if (this.userPuzzlesToShowInBoards[blockIndex].length >= block.puzzlesPlayed.length) {
      this.showMoreButtons[blockIndex] = false;
    }
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

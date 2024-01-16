import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Funcionalidad: que al mostrar la solucion lo haga que cada jugada deje flechas,  despues
 * las piezas se disuelvan y queden las flechas en un efecto de fade out dramatico
 * para que se evidencie el patron con las flechas
 * */

// models
import { Puzzle } from '@models/puzzle.model';
import { Plan, Block } from '@models/plan.model';

// Services
import { PlanService } from '@services/plan.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit {

  currentIndexBlock = 0;
  plan: Plan;
  puzzleToPlay: Puzzle;
  timeLeft = 0;
  timerUnsubscribe$ = new Subject<void>();

  constructor(
    private planService: PlanService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.planService.getPlan().then((plan: Plan) => {
      console.log('Plan', plan);
      if (!plan) {
        this.navController.navigateRoot('/puzzles/training-menu');
        return;
      }
      this.plan = plan;
      this.playPlan();
    });
  }

  playPlan() {
    this.selectPuzzleToPlay();
    this.initTimeToEndPlan(this.plan.time);
  }

  selectPuzzleToPlay() {
    const puzzle = {
      ...this.plan.blocks[this.currentIndexBlock].puzzles.find(puzzleItem =>
        !this.plan.blocks[this.currentIndexBlock]?.puzzlesPlayed?.find(puzzlePlayed => puzzlePlayed.uidPuzzle === puzzleItem.uid))
    };

    if (this.plan.blocks[this.currentIndexBlock].goshPuzzleTime) {
      puzzle.goshPuzzleTime = this.plan.blocks[this.currentIndexBlock].goshPuzzleTime;
    }
    if (this.plan.blocks[this.currentIndexBlock].puzzleTimes) {
      puzzle.times = this.plan.blocks[this.currentIndexBlock].puzzleTimes;
    }

    this.puzzleToPlay = puzzle;

    console.log('Puzzle to play', this.puzzleToPlay);


  }

  // init countDown
  initTimeToEndPlan(timePlan: number) {

    this.timeLeft = timePlan;
    const countDown = interval(1000);
    countDown.pipe(
      takeUntil(this.timerUnsubscribe$)
    ).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        // unsubscribe
        this.stopPlanTimer();
      }
    });
  }

  stopPlanTimer() {
    this.timerUnsubscribe$.next();
    this.timerUnsubscribe$.complete();
  }

  onPuzzleCompleted(puzzleCompleted: Puzzle, puzzleStatus: 'good' | 'bad') {

  }

}

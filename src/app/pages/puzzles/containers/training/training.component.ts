import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Funcionalidad: que al mostrar la solución lo haga que cada jugada deje flechas,  después
 * las piezas se disuelvan y queden las flechas en un efecto de fade out dramático
 * para que se evidencie el patron con las flechas
 * */

// models
import { Puzzle } from '@models/puzzle.model';
import { UserPuzzle } from '@models/user-puzzles.model';
import { Plan, Block } from '@models/plan.model';

// Services
import { PlanService } from '@services/plan.service';
import { ProfileService } from '@services/profile.service';

// utils
import { createUid } from '@utils/create-uid';

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
    private navController: NavController,
    private profileService: ProfileService
  ) {
  }

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

  onPuzzleCompleted(puzzleCompleted: Puzzle, puzzleStatus: 'good' | 'bad' | 'timeOut') {

    const userPuzzle: UserPuzzle = {
      uid: createUid(),
      uidUser: this.profileService.getProfile.uid,
      uidPuzzle: puzzleCompleted.uid,
      date: new Date().getTime(),
      resolved: puzzleStatus === 'good',
      resolvedTime: puzzleCompleted.timeUsed,
      currentEloUser: this.profileService.getProfile.elo,
      eloPuzzle: puzzleCompleted.rating,
      themes: puzzleCompleted.themes,
      openingFamily: puzzleCompleted.openingFamily,
      openingVariation: puzzleCompleted.openingVariation,
    };


    // Crear una copia del bloque actual
    const currentBlock = {
      ...this.plan.blocks[this.currentIndexBlock],
      puzzlesPlayed: [...this.plan.blocks[this.currentIndexBlock].puzzlesPlayed, userPuzzle]
    };

    // Crear una nueva copia de todos los bloques
    const newBlocks = [...this.plan.blocks];
    // Reemplazar el bloque actual con la copia actualizada
    newBlocks[this.currentIndexBlock] = currentBlock;

    // Ahora actualizar el plan con los nuevos bloques
    this.plan = {
      ...this.plan,
      blocks: newBlocks
    };

    switch (puzzleStatus) {
      case 'good':
        this.selectPuzzleToPlay();
        break;
      case 'bad':
        this.selectPuzzleToPlay();
        break;
      case 'timeOut':
        this.selectPuzzleToPlay();
        break;

      default:
        break;
    }

  }

}

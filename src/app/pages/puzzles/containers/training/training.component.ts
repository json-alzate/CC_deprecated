import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

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
import { AppService } from '@services/app.service';

// utils
import { createUid } from '@utils/create-uid';

// components
import { BlockPresentationComponent } from '@pages/puzzles/components/block-presentation/block-presentation.component';

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

  timeLeftBlock = 0;
  timerUnsubscribeBlock$ = new Subject<void>();
  countPuzzlesPlayedBlock = 0;

  constructor(
    private planService: PlanService,
    private navController: NavController,
    private profileService: ProfileService,
    private modalController: ModalController,
    private appService: AppService
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
      this.showBlockPresentation();
    });
  }

  async showBlockPresentation() {

    const themeName = this.plan.blocks[this.currentIndexBlock].themes[0];

    const theme = themeName ?
      this.appService.getThemePuzzleByValue(themeName).nameEs :
      this.plan.blocks[this.currentIndexBlock].openingFamily;

    const title = this.plan.blocks[this.currentIndexBlock].title ?
      this.plan.blocks[this.currentIndexBlock].title :
      theme;

    let image = 'assets/images/puzzle-themes/opening.svg';
    if (themeName) {
      // si el tema es mateIn1, mateIn2, mateIn3, mateIn4, mateIn5, mateIn6, mateIn7, mateIn8, etc se debe mostrar el tema mate
      if (themeName.includes('mateIn')) {
        image = 'assets/images/puzzle-themes/mate.svg';
      } else {
        image = `assets/images/puzzle-themes/${themeName}.svg`;
      }
    }

    const modal = await this.modalController.create({
      component: BlockPresentationComponent,
      componentProps: {
        title,
        description: this.plan.blocks[this.currentIndexBlock].description || this.appService.getThemePuzzleByValue(themeName).descriptionEs,
        image,
      }
    });

    await modal.present();

    modal.onDidDismiss().then((data) => {
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

  initTimeToEndBlock(timeBlock: number) {
    this.timeLeftBlock = timeBlock;
    const countDown = interval(1000);
    countDown.pipe(
      takeUntil(this.timerUnsubscribeBlock$)
    ).subscribe(() => {
      if (this.timeLeftBlock > 0) {
        this.timeLeftBlock--;
      } else {
        // unsubscribe
        this.stopBlockTimer();
      }
    });
  }

  stopBlockTimer() {
    this.timerUnsubscribeBlock$.next();
    this.timerUnsubscribeBlock$.complete();
  }

  stopPlanTimer() {
    this.stopBlockTimer();
    this.timerUnsubscribe$.next();
    this.timerUnsubscribe$.complete();
  }

  onPuzzleCompleted(puzzleCompleted: Puzzle, puzzleStatus: 'good' | 'bad' | 'timeOut') {

    this.countPuzzlesPlayedBlock++;

    const userPuzzle: UserPuzzle = {
      uid: createUid(),
      uidUser: this.profileService.getProfile?.uid,
      uidPuzzle: puzzleCompleted.uid,
      date: new Date().getTime(),
      resolved: puzzleStatus === 'good',
      resolvedTime: puzzleCompleted.timeUsed,
      currentEloUser: this.profileService.getProfile?.elo || 0,
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

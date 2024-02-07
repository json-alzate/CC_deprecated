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
import { SoundsService } from '@services/sounds.service';

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

  //ui
  showBlockTimer = false;

  currentIndexBlock = -1; // -1 para que al iniciar se seleccione el primer bloque sumando ++ y queda en 0
  plan: Plan;
  puzzleToPlay: Puzzle;
  timeTraining = 0;
  timerUnsubscribe$ = new Subject<void>();

  timeLeftBlock = 0;
  timerUnsubscribeBlock$ = new Subject<void>();
  countPuzzlesPlayedBlock = 0;
  totalPuzzlesInBlock = 0;

  showEndPlan = false;

  constructor(
    private planService: PlanService,
    private navController: NavController,
    private profileService: ProfileService,
    private modalController: ModalController,
    private appService: AppService,
    private soundsService: SoundsService
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
      this.playNextBlock();
    });
  }

  playNextBlock() {
    this.currentIndexBlock++;

    // se valida si se ha llegado al final del plan
    if (this.currentIndexBlock === this.plan.blocks.length) {
      this.endPlan();
      return;
    }

    this.totalPuzzlesInBlock = this.plan.blocks[this.currentIndexBlock].puzzlesCount;



    this.countPuzzlesPlayedBlock = 0;
    this.showBlockTimer = false;
    this.pausePlanTimer();
    this.showBlockPresentation();
  }

  async showBlockPresentation() {

    this.pauseBlockTimer();

    this.totalPuzzlesInBlock = this.plan.blocks[this.currentIndexBlock].puzzlesCount;

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
      this.selectPuzzleToPlay();
      if (this.plan.blocks[this.currentIndexBlock].time !== -1) {
        this.showBlockTimer = true;
        this.initTimeToEndBlock(this.plan.blocks[this.currentIndexBlock].time);
      } else {
        this.showBlockTimer = false;
        this.stopBlockTimer();
      }
    });


  }


  selectPuzzleToPlay() {

    // se valida si el bloque es por cantidad de puzzles y si ya se jugaron todos
    if (this.plan.blocks[this.currentIndexBlock].puzzlesCount !== 0 &&
      this.countPuzzlesPlayedBlock === this.plan.blocks[this.currentIndexBlock].puzzlesCount) {
      this.playNextBlock();
      return;
    }

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
  playPlan() {

    const countDown = interval(1000);
    countDown.pipe(
      takeUntil(this.timerUnsubscribe$)
    ).subscribe(() => {
      this.timeTraining++;
    });
  }

  initTimeToEndBlock(timeBlock: number) {
    this.timeLeftBlock = timeBlock;
    this.timerUnsubscribeBlock$ = new Subject<void>();
    const countDown = interval(1000);
    countDown.pipe(
      takeUntil(this.timerUnsubscribeBlock$)
    ).subscribe(() => {
      if (this.timeLeftBlock > 0) {
        this.timeLeftBlock--;
      } else {
        // unsubscribe
        this.stopBlockTimer();
        this.playNextBlock();
      }
    });
  }


  endPlan() {
    console.log('Plan finalizado');
  }

  pauseBlockTimer() {
    this.timerUnsubscribeBlock$.next();
  }

  resumeBlockTimer() {
    this.initTimeToEndBlock(this.timeLeftBlock);
  }

  stopBlockTimer() {
    this.timerUnsubscribeBlock$.next();
    this.timerUnsubscribeBlock$.complete();
  }

  pausePlanTimer() {

    this.timerUnsubscribe$.next();

  }



  stopPlanTimer() {
    console.log('Plan finalizado ', this.plan);


    this.stopBlockTimer();
    this.showEndPlan = true;
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
      fenPuzzle: puzzleCompleted.fen
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
        this.soundsService.playGood();
        break;
      case 'bad':
        this.soundsService.playError();
        break;
      case 'timeOut':
        this.soundsService.playLowTime();
        break;
    }
    this.selectPuzzleToPlay();

  }

}

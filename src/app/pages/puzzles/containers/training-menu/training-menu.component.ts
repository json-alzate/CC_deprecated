import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';

import { Meta } from '@angular/platform-browser';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

import { Plan, Block, PlanTypes } from '@models/plan.model';
import { PlanService } from '@services/plan.service';
import { BlockService } from '@services/block.service';
import { ProfileService } from '@services/profile.service';

import { PlanChartComponent } from '@pages/puzzles/components/plan-chart/plan-chart.component';

@Component({
  selector: 'app-training-menu',
  templateUrl: './training-menu.component.html',
  styleUrls: ['./training-menu.component.scss'],
})
export class TrainingMenuComponent implements OnInit {

  loader: any;
  generalEloPlan5: string | number = '1500?';
  generalEloPlan10: string | number = '1500?';
  generalEloPlan20: string | number = '1500?';
  generalEloPlan30: string | number = '1500?';

  loadActivityChart = false;


  constructor(
    private navController: NavController,
    private planService: PlanService,
    private blockService: BlockService,
    private loadingController: LoadingController,
    private profileService: ProfileService,
    private meta: Meta,
    private googleTagManagerService: GoogleTagManagerService,
    private modalController: ModalController,
    private translocoService: TranslocoService
  ) { }

  ngOnInit() {
    this.meta.addTags([
      { name: 'title', content: 'ChessColate' },
      { name: 'description', content: 'Planes de entrenamiento táctico de ajedrez listos para jugar.' },
      { name: 'keywords', content: 'ajedrez, táctica, entrenamiento, chess, tactic, training chess' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'ChessColate' },
      { property: 'og:description', content: 'Planes de entrenamiento táctico de ajedrez listos para jugar.' },
      { property: 'og:image', content: 'https://chesscolate.com/assets/tags/chesscolate.jpg' },
      { property: 'og:url', content: 'https://chesscolate.com/puzzles/training-menu' }
    ]);
  }

  ionViewDidEnter() {
    this.profileService.subscribeToProfile().subscribe((profile) => {
      if (profile) {
        this.generalEloPlan5 = profile.elos?.plan5Total || '1500?';
        this.generalEloPlan10 = profile.elos?.plan10Total || '1500?';
        this.generalEloPlan20 = profile.elos?.plan20Total || '1500?';
        this.generalEloPlan30 = profile.elos?.plan30Total || '1500?';
      }
    });
    this.loadActivityChart = true;
  }

  async createPlan(option: number, planType: PlanTypes) {
    this.showLoading();
    const blocks: Block[] = await this.blockService.generateBlocksForPlan(option);

    // se recorre cada bloque para generar los puzzles
    for (const block of blocks) {
      block.puzzles = await this.blockService.getPuzzlesForBlock(block);
    }

    const newPlan: Plan = await this.planService.newPlan(blocks, planType, option * 60);
    this.closeLoading();
    this.googleTagManagerService.pushTag({ event: 'newPlan', planType, planTime: option });
    this.goTo('/puzzles/training');

  }


  async showLoading() {
    this.loader = await this.loadingController.create({
      message: this.translocoService.translate('loadingPuzzles'),
    });

    this.loader.present();
  }

  closeLoading() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  async showChart(planType: PlanTypes) {

    const modal = await this.modalController.create({
      component: PlanChartComponent,
      componentProps: {
        planType,
        isModal: true
      }
    });

    await modal.present();
    // this.googleTagManagerService.pushTag({ event: 'showChart', planType: planType });
  }


  goTo(path: string) {
    this.navController.navigateForward(path);
  }

}

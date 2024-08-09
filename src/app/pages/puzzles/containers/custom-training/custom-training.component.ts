import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { BlockSettingsComponent } from '@pages/puzzles/components/block-settings/block-settings.component';

@Component({
  selector: 'app-custom-training',
  templateUrl: './custom-training.component.html',
  styleUrls: ['./custom-training.component.scss'],
})
export class CustomTrainingComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  async openBlockSettingsModal() {
    const modal = await this.modalController.create({
      component: BlockSettingsComponent,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.25, 0.5, 0.75],

    });
    modal.present();
  }

}

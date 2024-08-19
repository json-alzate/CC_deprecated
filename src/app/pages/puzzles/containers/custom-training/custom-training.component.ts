import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { createUid } from '@utils/create-uid';

import { Plan, Block } from '@models/plan.model';

import { ProfileService } from '@services/profile.service';

import { BlockSettingsComponent } from '@pages/puzzles/components/block-settings/block-settings.component';

@Component({
  selector: 'app-custom-training',
  templateUrl: './custom-training.component.html',
  styleUrls: ['./custom-training.component.scss'],
})
export class CustomTrainingComponent implements OnInit {


  blocks: Block[] = [];


  constructor(
    private modalController: ModalController,
    private profileService: ProfileService
  ) { }

  ngOnInit() { }

  async openBlockSettingsModal() {
    const modal = await this.modalController.create({
      component: BlockSettingsComponent,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.25, 0.5, 0.75],

    });
    modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.blocks.push(data);
      console.log(data);
    }
  }

  doReorder(event: any) {
    // Reordenar los elementos de la lista
    const itemMove = this.blocks.splice(event.detail.from, 1)[0];
    this.blocks.splice(event.detail.to, 0, itemMove);
    // Completar el evento de reorder
    event.detail.complete();
  }

  saveAndPlay() {
    // TODO: Se suma el tiempo de los bloques, y se calcula el tiempo total para obtener el elo total,
    // obteniéndolo de un plan predeterminado (si se tiene), sino es 1500

    // Se calcula el tiempo total de los bloques
    const totalBlockTime = this.blocks.reduce((sum, block) => sum + block.time, 0);
    console.log('totalBlockTime', totalBlockTime);


    const newPlan: Plan = {
      uid: createUid(),
      uidUser: this.profileService.getProfile.uid,
      createdAt: new Date().getTime(),
      planType: 'custom',
      blocks: this.blocks
    };

  }

}

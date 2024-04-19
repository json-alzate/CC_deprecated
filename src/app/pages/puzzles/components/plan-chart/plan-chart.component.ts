import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { Chart, registerables } from 'chart.js';


import { PlanTypes } from '@models/plan.model';
import { Profile } from '@models/profile.model';

import { ProfileService } from '@services/profile.service';


@Component({
  selector: 'app-plan-chart',
  templateUrl: './plan-chart.component.html',
  styleUrls: ['./plan-chart.component.scss'],
})
export class PlanChartComponent implements OnInit, AfterViewInit {

  @Input() planType: PlanTypes;
  profile: Profile;
  totalElo = 1500;
  themesLabels: string[] = [];
  themesElos: number[] = [];
  openingsLabels: string[] = [];
  openingsElos: number[] = [];

  constructor(
    private modalController: ModalController,
    private profileService: ProfileService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {


  }

  ngAfterViewInit() {
    this.profileService.subscribeToProfile().pipe().subscribe(profile => {
      this.profile = profile;

    });
    const elos = this.profileService.getElosThemesByPlanType(this.planType);
    this.totalElo = this.profileService.getEloTotalByPlanType(this.planType);
    const openings = this.profileService.getElosOpeningsByPlanType(this.planType);

    // ordenar elos de menor a mayor
    const elosShort = Object.entries(elos).sort((a, b) => a[1] - b[1]);
    const openingsShort = Object.entries(openings).sort((a, b) => a[1] - b[1]);

    // get from shortened object

    elosShort.forEach(([key, value]) => {
      this.themesLabels = [...this.themesLabels, key];
      this.themesElos = [...this.themesElos, value];
    });

    openingsShort.forEach(([key, value]) => {
      this.openingsLabels = [...this.openingsLabels, key];
      this.openingsElos = [...this.openingsElos, value];
    });
  }

  close() {
    this.modalController.dismiss();
  }

}

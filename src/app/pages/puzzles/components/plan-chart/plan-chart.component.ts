import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { PlanTypes } from '@models/plan.model';
import { Profile } from '@models/profile.model';

import { ProfileService } from '@services/profile.service';


@Component({
  selector: 'app-plan-chart',
  templateUrl: './plan-chart.component.html',
  styleUrls: ['./plan-chart.component.scss'],
})
export class PlanChartComponent implements OnInit {

  @Input() planType: PlanTypes;
  profile: Profile;
  totalElo = 1500;
  themes: { [key: string]: number } = {};
  openings: string[] = [];
  constructor(
    private modalController: ModalController,
    private profileService: ProfileService
  ) {

  }

  ngOnInit() {
    this.profileService.subscribeToProfile().pipe().subscribe(profile => {
      this.profile = profile;

    });
    const elos = this.profileService.getElosThemesByPlanType(this.planType);
    this.totalElo = this.profileService.getEloTotalByPlanType(this.planType);
    const openings = this.profileService.getElosOpeningsByPlanType(this.planType);
    console.log(elos);
    console.log(openings);

  }

  close() {
    this.modalController.dismiss();
  }

}

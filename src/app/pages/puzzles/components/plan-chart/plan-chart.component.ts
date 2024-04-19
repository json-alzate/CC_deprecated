import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';

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

  @ViewChild('themesUpCanvas') themesUpCanvas;
  @ViewChild('themesDownCanvas') themesDownCanvas;
  @ViewChild('openingsUpCanvas') openingsUpCanvas;
  @ViewChild('openingsDownCanvas') openingsDownCanvas;

  themeChart: Chart;
  openingChart: Chart;

  @Input() planType: PlanTypes;
  @Input() isModal: boolean;
  profile: Profile;
  totalElo = 1500;
  themesLabels: string[] = [];
  themesElos: number[] = [];
  openingsLabels: string[] = [];
  openingsElos: number[] = [];

  segment = 'themesUp';

  options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      r: {
        angleLines: {
          color: '#bf811c',
        },
        ticks: {
          color: 'white',
          backdropColor: 'transparent',
        }
      }
    }
  };

  constructor(
    private modalController: ModalController,
    private profileService: ProfileService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {

    console.log('Plan type ', this.planType);

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

  ngAfterViewInit() {

    this.buildThemesUpChart();
    this.buildThemesDownChart();
    this.buildOpeningsUpChart();
    this.buildOpeningsDownChart();
  }

  buildThemesUpChart() {

    this.themeChart = new Chart(this.themesUpCanvas.nativeElement, {
      type: 'radar',
      data: {
        // se obtienen los últimos 7 elementos
        labels: this.themesLabels.slice(-7),
        datasets: [
          {
            label: 'Elo',
            data: this.themesElos.slice(-7),
            backgroundColor: 'rgba(47, 223, 117, 0.2)',
            borderColor: 'rgba(41, 196, 103, 0.2)',
            borderWidth: 1,
          }
        ]
      },
      options: this.options
    });

  }

  buildThemesDownChart() {
    this.themeChart = new Chart(this.themesDownCanvas.nativeElement, {
      type: 'radar',
      data: {
        // se obtienen los primeros 7 elementos
        labels: this.themesLabels.slice(0, 7),
        datasets: [
          {
            label: 'Elo',
            data: this.themesElos.slice(0, 7),
            backgroundColor: 'rgba(255, 73, 97, 0.2)',
            borderColor: 'rgba(224, 64, 85, 0.2)',
            borderWidth: 1,
          }
        ]
      },
      options: this.options
    });
  }

  buildOpeningsUpChart() {

    this.openingChart = new Chart(this.openingsUpCanvas.nativeElement, {
      type: 'radar',
      data: {
        // se obtienen los últimos 7 elementos
        labels: this.openingsLabels.slice(-7),
        datasets: [
          {
            label: 'Elo',
            data: this.openingsElos.slice(-7),
            backgroundColor: 'rgba(47, 223, 117, 0.2)',
            borderColor: 'rgba(41, 196, 103, 0.2)',
            borderWidth: 1,
          }
        ]
      },
      options: this.options
    });
  }

  buildOpeningsDownChart() {

    this.openingChart = new Chart(this.openingsDownCanvas.nativeElement, {
      type: 'radar',
      data: {
        // se obtienen los primeros 7 elementos
        labels: this.openingsLabels.slice(0, 7),
        datasets: [
          {
            label: 'Elo',
            data: this.openingsElos.slice(0, 7),
            backgroundColor: 'rgba(255, 73, 97, 0.2)',
            borderColor: 'rgba(224, 64, 85, 0.2)',
            borderWidth: 1,
          }
        ]
      },
      options: this.options
    });
  }

  close() {
    this.modalController.dismiss();
  }

}

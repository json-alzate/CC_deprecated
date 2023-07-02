import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

import { SquaresService } from '@services/squares.service';

@Component({
  selector: 'app-statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.scss'],
})
export class StaticsComponent implements OnInit, AfterViewInit {

  @ViewChild('lineCanvas') lineCanvas;
  lineChart: Chart;
  scores: number[] = [];

  constructor(
    private squaresService: SquaresService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.lineChartMethod();
    this.squaresService.scores$.subscribe((scores) => {
      this.scores = scores;
      this.updateChart();
    });
    this.squaresService.getScores();
  }

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: 'rgba(66,140,255, 0.2)',
            borderColor: 'rgba(66,140,255, 1)',
            borderWidth: 1,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {  // configuración del eje Y
            // beginAtZero: true,  // hace que el eje Y comience en 0
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }
    });
  }

  updateChart() {
    this.lineChart.data.labels = this.scores.map((score, index) => index + 1);
    this.lineChart.data.datasets[0].data = this.scores;
    this.lineChart.update();
  }


}

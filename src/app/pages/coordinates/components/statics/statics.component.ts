import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.scss'],
})
export class StaticsComponent implements OnInit, AfterViewInit {

  @ViewChild('lineCanvas') lineCanvas;
  lineChart: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() { }

  ngAfterViewInit() {
    console.log('entra');

    this.lineChartMethod();
  }


  lineChartMethod() {

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: 'Blancas',
            data: [42, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          },
          {
            label: 'Negras',
            data: [12, 9, 13, 25, 22, 13],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }
        ]
      },
      options: {
        responsive: true
      },
    });

  }

}

import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Chart, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Filler, TimeScale } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { startOfToday, formatISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'chartjs-adapter-date-fns';

import { Plan } from '@models/plan.model';

interface DataGroup {
  date: string;
  value: number;
}


@Component({
  selector: 'app-activity-chart',
  templateUrl: './activity-chart.component.html',
  styleUrls: ['./activity-chart.component.scss'],
})
export class ActivityChartComponent implements OnInit {


  @ViewChild('matrixChart') matrixChartRef: ElementRef;

  dataGroup: DataGroup[] = [];
  private chart: Chart; // Instancia del gráfico

  constructor() {
    Chart.register(MatrixController, MatrixElement,
      LinearScale, CategoryScale, PointElement,
      LineElement, Title, Tooltip, Filler,
      TimeScale);
  }

  @Input() set data(plans: Plan[]) {

    if (plans && plans.length > 0) {
      // Crear un objeto para almacenar los datos agrupados
      const dataGroup = [];
      // Recorrer los mensajes filtrados y agrupar por fecha
      plans.forEach(plan => {
        // Obtener la fecha en formato 'yyyy-MM-dd'
        const date = format(new Date(plan.createdAt), 'yyyy-MM-dd');
        // Buscar si ya existe un objeto en el arreglo dataGroup con la misma fecha
        const existingData = dataGroup.find(data => data.date === date);
        if (existingData) {
          // Si la fecha ya existe, incrementar el valor en 1
          existingData.value += 1;
        } else {
          // Si la fecha no existe, crear un nuevo objeto con la fecha y valor 1
          dataGroup.push({ date, value: 1 });
        }
      });

      this.dataGroup = dataGroup;

    }

  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      // Actualizar los datos del gráfico cuando se reciban nuevos datos
      if (this.chart) {
        this.chart.data.datasets[0].data = this.generateData();
        this.chart.update();
      }
    }
  }


  isoDayOfWeek(dt) {
    let wd = dt.getDay(); // 0..6, from sunday
    wd = (wd + 6) % 7 + 1; // 1..7 from monday
    return '' + wd; // string so it gets parsed
  }

  generateData() {
    const data = [];
    const end = startOfToday();
    let dt = new Date(new Date().setDate(end.getDate() - 365));
    while (dt <= end) {
      const iso = format(dt, 'yyyy-MM-dd');

      // Buscar si la fecha coincide con alguna fecha en dataGroup
      const dataGroupItem = this.dataGroup.find(dataGroup => dataGroup.date === iso);

      data.push({
        x: iso,
        y: this.isoDayOfWeek(dt),
        d: iso,
        v: dataGroupItem ? dataGroupItem.value : 0 // Asignar value si existe, 0 si no
      });
      dt = new Date(dt.setDate(dt.getDate() + 1));
    }
    return data;
  }


  ngAfterViewInit() {

    this.chart = new Chart(this.matrixChartRef.nativeElement, {
      type: 'matrix',
      data: {
        datasets: [{
          label: '',
          data: this.generateData(),
          // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
          backgroundColor(c) {
            const v = c.dataset.data[c.dataIndex] as any;
            const value = v.v;
            const valueToDivide = v.v > 0 ? 30 : 60;
            const alpha = (10 + value) / valueToDivide;
            return `rgba(78, 115, 38, ${alpha})`;
          },
          borderColor: 'rgba(0,0,0,0.5)',
          borderWidth: 1,
          hoverBackgroundColor: 'yellow',
          hoverBorderColor: 'yellowgreen',
          width: ({ chart }) => ((chart.chartArea || {}).right - (chart.chartArea || {}).left) / 53 - 1,
          height: ({ chart }) => ((chart.chartArea || {}).bottom - (chart.chartArea || {}).top) / 7 - 1,
        }]
      },
      options: {
        aspectRatio: 5,
        plugins: {
          tooltip: {
            displayColors: false,
            callbacks: {
              // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
              title() {
                return '';
              },
              // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
              label(context) {
                const v = context.dataset.data[context.dataIndex] as any;
                return [v.x, v.v];
              }
            }
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            type: 'time',
            offset: true,
            adapters: {
              date: {
                locale: es
              }
            },
            time: {
              unit: 'day',
              round: 'day',
              isoWeekday: 1,
              parser: 'i',
              displayFormats: {
                day: 'iiiiii'
              }
            },
            reverse: true,
            position: 'right',
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              padding: 1,
              font: {
                size: 9
              }
            },
            grid: {
              display: false,
              tickLength: 0
            }
          },
          x: {
            type: 'time',
            position: 'bottom',
            offset: true,
            adapters: {
              date: {
                locale: es
              }
            },
            time: {
              unit: 'week',
              round: 'week',
              isoWeekday: 1,
              displayFormats: {
                week: 'MMM dd'
              }
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              font: {
                size: 9
              }
            },
            grid: {
              display: false,
              tickLength: 0,
            }
          }
        },
        layout: {
          padding: {
            top: 10
          }
        }
      }
    });
  }


}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Plan } from '@models/plan.model';

@Component({
  selector: 'app-custom-plans-slides',
  templateUrl: './custom-plans-slides.component.html',
  styleUrls: ['./custom-plans-slides.component.scss'],
})
export class CustomPlansSlidesComponent implements OnInit {

  @Input() plans: Plan[] = [];
  @Output() slideClick: EventEmitter<boolean> = new EventEmitter();
  // un arreglo con 5 numeros aleatorios del 0 al 9
  randomNumber: number[] = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));

  constructor() { }

  ngOnInit() { }

}

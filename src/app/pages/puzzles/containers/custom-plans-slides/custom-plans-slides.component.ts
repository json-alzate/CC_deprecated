import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Plan } from '@models/plan.model';

@Component({
  selector: 'app-custom-plans-slides',
  templateUrl: './custom-plans-slides.component.html',
  styleUrls: ['./custom-plans-slides.component.scss'],
})
export class CustomPlansSlidesComponent implements OnInit {

  @Input() plans: Plan[] = [];
  @Output() slideClick: EventEmitter<Plan> = new EventEmitter();
  // un arreglo con 5 números aleatorios del 0 al 9 y que ningún numero aparezca mas de una vez
  randomNumber: number[] = this.generateUniqueRandomNumbers(5);

  slideLoading = -1;

  constructor() { }

  ngOnInit() { }

  generateUniqueRandomNumbers(length: number): number[] {
    const uniqueNumbers: number[] = [];
    while (uniqueNumbers.length < length) {
      const randomNumber = Math.floor(Math.random() * 10);
      if (!uniqueNumbers.includes(randomNumber)) {
        uniqueNumbers.push(randomNumber);
      }
    }
    return uniqueNumbers;
  }

  onChoosePlan(plan: Plan, i: number) {
    this.slideLoading = i;
    this.slideClick.emit(plan);
    setTimeout(() => {
      this.slideLoading = -1;
    }, 2000);
  }

}

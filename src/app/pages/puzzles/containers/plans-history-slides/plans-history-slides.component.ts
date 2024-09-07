import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Plan } from '@models/plan.model';

@Component({
  selector: 'app-plans-history-slides',
  templateUrl: './plans-history-slides.component.html',
  styleUrls: ['./plans-history-slides.component.scss'],
})
export class PlansHistorySlidesComponent implements OnInit {

  @Input() plans: Plan[] = [];
  @Output() slideClick: EventEmitter<boolean> = new EventEmitter();

  slidesOPtions = {
    slidesPerView: 3,
  };

  constructor() { }

  ngOnInit() { }

  goToPlanDetails(plan) {
    console.log('Plan ', plan);

  }

}

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

  constructor() { }

  ngOnInit() { }

}

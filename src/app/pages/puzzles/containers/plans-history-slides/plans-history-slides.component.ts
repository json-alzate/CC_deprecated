import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';

import { NavController } from '@ionic/angular';

import { Plan } from '@models/plan.model';

import { PlanService } from '@services/plan.service';

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

  constructor(
    private navController: NavController,
    private planService: PlanService,
    private router: Router
  ) { }

  ngOnInit() { }

  goToPlanDetails(plan) {
    this.planService.setPlanAction(plan);
    console.log('Plan ', plan);

    this.router.navigate(['/puzzles/plan-played']);
  }

}

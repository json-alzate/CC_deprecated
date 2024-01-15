import { Component, OnInit } from '@angular/core';
/**
 * Funcionalidad: que al mostrar la solucion lo haga que cada jugada deje flechas,  despues
 * las piezas se disuelvan y queden las flechas en un efecto de fade out dramatico
 * para que se evidencie el patron con las flechas
 * */

import { Plan, Block } from '@models/plan.model';

// Services
import { PlanService } from '@services/plan.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit {

  constructor(
    private planService: PlanService
  ) { }

  ngOnInit() {
    this.planService.getPlan().then((plan: Plan) => {
      console.log('Plan', plan);
    });
  }

}

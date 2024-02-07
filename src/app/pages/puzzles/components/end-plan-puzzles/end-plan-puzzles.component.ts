import { Component, OnInit, Input } from '@angular/core';

import { UserPuzzle } from '@models/user-puzzles.model';

@Component({
  selector: 'app-end-plan-puzzles',
  templateUrl: './end-plan-puzzles.component.html',
  styleUrls: ['./end-plan-puzzles.component.scss'],
})
export class EndPlanPuzzlesComponent implements OnInit {

  @Input() userPuzzles: UserPuzzle[] = [];

  constructor() { }

  ngOnInit() { }

}

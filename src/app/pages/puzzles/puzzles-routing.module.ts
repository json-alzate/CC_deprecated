import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuzzlesPage } from './puzzles.page';
import { TrainingComponent } from './containers/training/training.component';
import { TitanMenuComponent } from './containers/titan-menu/titan-menu.component';
import { InfinityComponent } from './containers/infinity/infinity.component';

const routes: Routes = [
  {
    path: '',
    component: PuzzlesPage
  },
  {
    path: 'training',
    component: TrainingComponent
  },
  {
    path: 'titan',
    component: TitanMenuComponent
  },
  {
    path: 'infinity',
    component: InfinityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuzzlesPageRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuzzlesPage } from './puzzles.page';
import { TrainingComponent } from './containers/training/training.component';
import { InfiniteComponent } from './containers/infinite/infinite.component';

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
    path: 'infinite',
    component: InfiniteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuzzlesPageRoutingModule { }

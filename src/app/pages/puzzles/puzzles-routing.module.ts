import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuzzlesPage } from './puzzles.page';
import { TrainingComponent } from './containers/training/training.component';
import { TrainingMenuComponent } from './containers/training-menu/training-menu.component';

const routes: Routes = [
  {
    path: 'training-menu',
    component: TrainingMenuComponent
  },
  {
    path: 'training',
    component: TrainingComponent
  },
  {
    path: '**',
    redirectTo: 'training-menu',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuzzlesPageRoutingModule { }

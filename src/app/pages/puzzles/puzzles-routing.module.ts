import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuzzlesPage } from './puzzles.page';
import { TrainingComponent } from './containers/training/training.component';
import { TrainingMenuComponent } from './containers/training-menu/training-menu.component';
import { BlockTrainingComponent } from './containers/block-training/block-training.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: PuzzlesPage
  // },
  // redirectTo: training-menu if is empty
  {
    path: '',
    redirectTo: 'training-menu',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TrainingMenuComponent
  },
  // {
  //   path: 'portion',
  //   component: BlockTrainingComponent
  // }
  {
    path: 'training',
    component: TrainingComponent
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuzzlesPageRoutingModule { }

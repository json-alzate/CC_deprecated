import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuzzlesPage } from './puzzles.page';

const routes: Routes = [
  {
    path: '',
    component: PuzzlesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuzzlesPageRoutingModule {}

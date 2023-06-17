import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SquaresPage } from './squares.page';

const routes: Routes = [
  {
    path: '',
    component: SquaresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SquaresPageRoutingModule {}

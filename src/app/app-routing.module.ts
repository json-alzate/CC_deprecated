import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CoordinatesPuzzlesGuard } from '@guards/coordinates-puzzles.guard';
import { PuzzlesGuard } from '@guards/puzzles.guard';
import { UserPuzzlesGuard } from '@guards/user-puzzles.guard';
import { PlansGuard } from '@guards/plans.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'puzzles',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    canActivate: [PlansGuard],
    loadChildren: () => import('./pages/puzzles/puzzles.module').then(m => m.PuzzlesPageModule)
  },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
  // },
  {
    path: 'coordinates',
    canActivate: [CoordinatesPuzzlesGuard],
    loadChildren: () => import('./pages/coordinates/coordinates.module').then(m => m.CoordinatesPageModule)
  },
  {
    path: 'squares',
    loadChildren: () => import('./pages/squares/squares.module').then(m => m.SquaresPageModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

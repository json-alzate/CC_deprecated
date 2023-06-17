import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CoordinatesPuzzlesGuard } from '@guards/coordinates-puzzles.guard';
import { PuzzlesGuard } from '@guards/puzzles.guard';
import { UserPuzzlesGuard } from '@guards/user-puzzles.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'puzzles',
    pathMatch: 'full'
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
    path: 'puzzles',
    canActivate: [PuzzlesGuard, UserPuzzlesGuard],
    loadChildren: () => import('./pages/puzzles/puzzles.module').then(m => m.PuzzlesPageModule)
  },  {
    path: 'squares',
    loadChildren: () => import('./pages/squares/squares.module').then( m => m.SquaresPageModule)
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

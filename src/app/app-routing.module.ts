import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CoordinatesPuzzlesGuard } from '@guards/coordinates-puzzles.guard';
import { PuzzlesGuard } from '@guards/puzzles.guard';
import { UserPuzzlesGuard } from '@guards/user-puzzles.guard';
import { PlansGuard } from '@guards/plans.guard';

import { CustomPreloadingStrategy } from '@services/preloading-strategy.service';

const routes: Routes = [
  {
    path: 'puzzles',
    canActivate: [PlansGuard],
    loadChildren: () => import('./pages/puzzles/puzzles.module').then(m => m.PuzzlesPageModule)
  },
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
    path: 'privacy',
    loadChildren: () => import('./pages/privacy/privacy.module').then(m => m.PrivacyPageModule)
  },
  {
    path: '**',
    redirectTo: 'puzzles',
    pathMatch: 'full'
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingStrategy, initialNavigation: 'enabledBlocking' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

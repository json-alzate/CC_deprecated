import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CoordinatesPuzzlesGuard } from '@guards/coordinates-puzzles.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'coordinates',
    canActivate: [CoordinatesPuzzlesGuard],
    loadChildren: () => import('./pages/coordinates/coordinates.module').then(m => m.CoordinatesPageModule)
  },  {
    path: 'puzzles',
    loadChildren: () => import('./pages/puzzles/puzzles.module').then( m => m.PuzzlesPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

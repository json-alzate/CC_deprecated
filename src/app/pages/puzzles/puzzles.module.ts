import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PuzzlesPageRoutingModule } from './puzzles-routing.module';

import { PuzzlesPage } from './puzzles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PuzzlesPageRoutingModule
  ],
  declarations: [PuzzlesPage]
})
export class PuzzlesPageModule {}

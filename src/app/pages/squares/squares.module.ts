import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SquaresPageRoutingModule } from './squares-routing.module';

import { SquaresPage } from './squares.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SquaresPageRoutingModule
  ],
  declarations: [SquaresPage]
})
export class SquaresPageModule {}

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';


import * as fromComponents from './components/';
import * as fromPipes from './pipes';
import { GameClockPipe } from './pipes/game-clock.pipe';



@NgModule({
  declarations: [
    ...fromComponents.COMPONENTS,
    ...fromPipes.PIPES,
    GameClockPipe,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule
  ],
  exports: [
    ...fromComponents.ENTRY_COMPONENTS,
    TranslocoModule,
    ...fromPipes.PIPES,
  ]
})
export class SharedModule { }

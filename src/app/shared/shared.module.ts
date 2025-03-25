import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';



import * as fromComponents from './components/';
import * as fromPipes from './pipes';
import { GameClockPipe } from './pipes/game-clock.pipe';
import { SecondsToMinutesSecondsPipe } from './pipes/seconds-to-minutes-seconds.pipe';



@NgModule({
  declarations: [
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
  ]
})
export class SharedModule { }

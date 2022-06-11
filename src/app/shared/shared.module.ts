import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';


import * as fromComponents from './components/';
import { StringToFlagPipe } from './pipes/string-to-flag.pipe';


@NgModule({
  declarations: [
    ...fromComponents.COMPONENTS,
    StringToFlagPipe
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
    TranslocoModule
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';

import { PuzzlesPageRoutingModule } from './puzzles-routing.module';

import * as fromContainers from './containers';
import * as fromComponents from './components/';
import { PuzzlesPage } from './puzzles.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        PuzzlesPageRoutingModule,
        SharedModule
    ],
    declarations: [
        PuzzlesPage,
        ...fromComponents.COMPONENTS,
        ...fromContainers.CONTAINERS
    ]
})
export class PuzzlesPageModule { }

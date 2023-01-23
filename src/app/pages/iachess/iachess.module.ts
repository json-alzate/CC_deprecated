import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';


import { IachessPageRoutingModule } from './iachess-routing.module';

import * as fromContainers from './containers';
import * as fromComponents from './components/';
import { IachessPage } from './iachess.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IachessPageRoutingModule,
    SharedModule
  ],
  declarations: [
    IachessPage,
    ...fromComponents.COMPONENTS,
    ...fromContainers.CONTAINERS
  ]
})
export class IachessPageModule { }

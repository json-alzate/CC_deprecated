import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';


import { HomePageRoutingModule } from './home-routing.module';
import * as fromComponents from './components/';
// import * as fromContainers from './containers';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule
  ],
  declarations: [
    HomePage,
    ...fromComponents.COMPONENTS
  ],
  entryComponents: [
    ...fromComponents.ENTRY_COMPONENTS
  ]
})
export class HomePageModule {}

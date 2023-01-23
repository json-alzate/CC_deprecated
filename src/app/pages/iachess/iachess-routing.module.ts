import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IachessPage } from './iachess.page';
import { BotmeComponent } from './containers/botme/botme.component';

const routes: Routes = [
  {
    path: '',
    component: IachessPage
  },
  {
    path: 'botme',
    component: BotmeComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IachessPageRoutingModule { }

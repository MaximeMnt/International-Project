import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoisturePage } from './moisture.page';

const routes: Routes = [
  {
    path: '',
    component: MoisturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoisturePageRoutingModule {}

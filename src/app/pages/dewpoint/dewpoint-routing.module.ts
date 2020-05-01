import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DewpointPage } from './dewpoint.page';

const routes: Routes = [
  {
    path: '',
    component: DewpointPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DewpointPageRoutingModule {}

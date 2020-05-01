import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinddevicePage } from './finddevice.page';

const routes: Routes = [
  {
    path: '',
    component: FinddevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinddevicePageRoutingModule {}

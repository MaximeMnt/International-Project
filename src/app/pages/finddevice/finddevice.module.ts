import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinddevicePageRoutingModule } from './finddevice-routing.module';

import { FinddevicePage } from './finddevice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinddevicePageRoutingModule
  ],
  declarations: [FinddevicePage]
})
export class FinddevicePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DewpointPageRoutingModule } from './dewpoint-routing.module';
import { ChartsModule } from 'ng2-charts';

import { DewpointPage } from './dewpoint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    IonicModule,
    DewpointPageRoutingModule
  ],
  declarations: [DewpointPage]
})
export class DewpointPageModule {}

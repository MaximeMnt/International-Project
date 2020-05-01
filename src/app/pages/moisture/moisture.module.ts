import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoisturePageRoutingModule } from './moisture-routing.module';

import { MoisturePage } from './moisture.page';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    MoisturePageRoutingModule
  ],
  declarations: [MoisturePage]
})
export class MoisturePageModule {}

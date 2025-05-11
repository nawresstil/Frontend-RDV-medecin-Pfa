import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FeaturesRoutingModule} from './admin-features-routing.module';
// @ts-ignore
import { NgChartsModule } from 'ng2-charts';  // Correct import for the latest versions



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FeaturesRoutingModule,
    NgChartsModule,  // Correct module to import
  ]
})
export class FeaturesAdminModule { }




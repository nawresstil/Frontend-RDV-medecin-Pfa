import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SearchDotorComponent} from './Doctor/search-doctor/search-dotor.component';
import { DashboardDoctorComponent } from './Doctor/dashboard-doctor/dashboard-doctor.component';
import { FeaturesRoutingModule } from './features-routing.module';
import {PatientDashboardComponent} from './Patient/patient-dashboard/patient-dashboard.component';
import {AppointmentsComponent} from './Doctor/appointments/appointments.component';
import {ScheduleTimingsComponent} from './Doctor/schedule-timings/schedule-timings.component';
import {SceneEditorComponent} from './Doctor/scene-editor/scene-editor.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FeaturesRoutingModule,
    SearchDotorComponent,
    DashboardDoctorComponent,
    PatientDashboardComponent,
    AppointmentsComponent,
    ScheduleTimingsComponent,
    SceneEditorComponent
  ]
})
export class FeaturesModule { }

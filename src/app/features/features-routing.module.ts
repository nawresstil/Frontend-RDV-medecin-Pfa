import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SearchDotorComponent} from './Doctor/search-doctor/search-dotor.component';
import { DashboardDoctorComponent } from './Doctor/dashboard-doctor/dashboard-doctor.component';
import {PatientDashboardComponent} from './Patient/patient-dashboard/patient-dashboard.component';
import {AppointmentsComponent} from './Doctor/appointments/appointments.component';
import {MyPatientComponent} from './Doctor/my-patient/my-patient.component';
import {ScheduleTimingsComponent} from './Doctor/schedule-timings/schedule-timings.component';
import {ProfileSettingsComponent} from './Doctor/profile-doctor-settings/profile-settings.component';
import {DoctorUpdatePasswordComponent} from './Doctor/doctor-update-password/doctor-update-password.component';
import {PatientProfileComponent} from './Doctor/patient-profile/patient-profile.component';
import {ProfilePatientSettingComponent} from './Patient/profile-patient-setting/profile-patient-setting.component';
import {ChangePasswordComponent} from './Patient/change-password/change-password.component';
import {AddPrescriptionComponent} from './Doctor/add-prescription/add-prescription.component';
import {EditPrescriptionComponent} from './Doctor/edit-prescription/edit-prescription.component';

const routes: Routes = [
  { path: 'search', component: SearchDotorComponent },
  { path: 'doctor-dashboard', component: DashboardDoctorComponent },
  { path: 'patient-dashboard', component: PatientDashboardComponent },
  { path: 'appointment', component: AppointmentsComponent },
  { path: 'my-patient', component: MyPatientComponent },
  { path: 'schedule-timings', component: ScheduleTimingsComponent },
  { path: 'profile-doctor-settings', component: ProfileSettingsComponent },
  { path: 'update-doctor-password', component: DoctorUpdatePasswordComponent },
  {path: 'patient-profile', component: PatientProfileComponent},
  { path: 'profile-patient-settings', component: ProfilePatientSettingComponent },
  { path: 'update-patient-password', component: ChangePasswordComponent },
  { path: 'add-prescription', component: AddPrescriptionComponent },
  { path: 'edit-prescription', component: EditPrescriptionComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FeaturesRoutingModule { }

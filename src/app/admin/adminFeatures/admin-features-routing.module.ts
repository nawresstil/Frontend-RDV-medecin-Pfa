import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardAdminComponent} from './dashboard-admin/dashboard-admin.component';
import {AppointmentAdminComponent} from './appointment-admin/appointment-admin.component';
import {SpecialitiesAdminComponent} from './specialities-admin/specialities-admin.component';
import {DoctorsAdminComponent} from './doctors-admin/doctors-admin.component';
import {PatientsAdminComponent} from './patients-admin/patients-admin.component';
import {ProfileAdminComponent} from './profile-admin/profile-admin.component';

const routes: Routes = [
  { path: 'admin-dashboard', component: DashboardAdminComponent },
  { path: 'admin-appointment', component: AppointmentAdminComponent },
  { path: 'admin-specialities', component: SpecialitiesAdminComponent },
  { path: 'admin-doctors', component: DoctorsAdminComponent },
  { path: 'admin-patients', component: PatientsAdminComponent },
  { path: 'admin-profile', component: ProfileAdminComponent },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FeaturesRoutingModule { }

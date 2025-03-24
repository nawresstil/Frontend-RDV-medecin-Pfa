import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {SidebarDoctorComponent} from '../doctor-home/sidebar-doctor/sidebar-doctor.component';
import {NavbarDoctorComponent} from '../doctor-home/navbar-doctor/navbar-doctor.component';
import {SidebarPatientComponent} from './sidebar-patient/sidebar-patient.component';
import {NavbarPatientComponent} from './navbar-patient/navbar-patient.component';

@Component({
  selector: 'app-patient-home',
  standalone: true,
  imports: [RouterModule,SidebarPatientComponent,NavbarPatientComponent],
  templateUrl: './patient-home.component.html',
  styleUrl: './patient-home.component.css'
})
export class PatientHomeComponent {

}

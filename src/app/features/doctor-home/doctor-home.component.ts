import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {SidebarDoctorComponent} from './sidebar-doctor/sidebar-doctor.component';
import {NavbarDoctorComponent} from './navbar-doctor/navbar-doctor.component';


@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [RouterModule,SidebarDoctorComponent,NavbarDoctorComponent],
  templateUrl: './doctor-home.component.html',
  styleUrl: './doctor-home.component.css'
})
export class DoctorHomeComponent {

}

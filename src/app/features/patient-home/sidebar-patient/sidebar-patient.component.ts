import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterModule} from '@angular/router';

@Component({
  selector: 'app-sidebar-patient',
  standalone: true,
  imports:[CommonModule, RouterModule,RouterLink],
  templateUrl: './sidebar-patient.component.html',
  styleUrl: './sidebar-patient.component.css'
})
export class SidebarPatientComponent {

}

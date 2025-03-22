import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterModule} from '@angular/router';

@Component({
  selector: 'app-sidebar-doctor',
  standalone: true,
  imports:[CommonModule, RouterModule,RouterLink],
  templateUrl: './sidebar-doctor.component.html',
  styleUrl: './sidebar-doctor.component.css'
})
export class SidebarDoctorComponent {
}

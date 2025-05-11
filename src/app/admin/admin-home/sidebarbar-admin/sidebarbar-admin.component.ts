import { Component } from '@angular/core';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sidebarbar-admin',
  standalone:true,
  imports:[CommonModule, RouterModule,RouterLink],
  templateUrl: './sidebarbar-admin.component.html',
  styleUrl: './sidebarbar-admin.component.css'
})
export class SidebarbarAdminComponent {

}

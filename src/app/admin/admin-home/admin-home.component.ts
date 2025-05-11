import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {SidebarbarAdminComponent} from './sidebarbar-admin/sidebarbar-admin.component';
import {NavbarAdminComponent} from './navbar-admin/navbar-admin.component';

@Component({
  selector: 'app-admin-home',
  standalone:true,
  imports: [RouterModule, SidebarbarAdminComponent, NavbarAdminComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

}

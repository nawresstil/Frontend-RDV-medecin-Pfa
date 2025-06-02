import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import Swal from 'sweetalert2';
import {DoctorDto} from '../../../models/DoctorDto';
import {UserService} from '../../../features/services/user.service';
import {AuthenticationService} from '../../../features/login/services/authentification.service';
import {Users} from '../../../models/users';

@Component({
  selector: 'app-sidebarbar-admin',
  standalone:true,
  imports:[CommonModule, RouterModule,RouterLink],
  templateUrl: './sidebarbar-admin.component.html',
  styleUrl: './sidebarbar-admin.component.css'
})
export class SidebarbarAdminComponent implements OnInit {
  user!: Users;

  constructor(private userService: UserService, private authService: AuthenticationService,  private router: Router) {}

  ngOnInit() {
    this.userService.getConnectedUser().subscribe((data: Users) => {
      this.user = data;
    });
  }
  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your session.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        localStorage.clear();
        this.router.navigateByUrl('/');
      }
    });
  }
}

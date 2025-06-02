import { Component, OnInit } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import {DoctorDto} from '../../../models/DoctorDto';
import {AuthenticationService} from '../../login/services/authentification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar-doctor',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar-doctor.component.html',
  styleUrl: './sidebar-doctor.component.css'
})
export class SidebarDoctorComponent implements OnInit {
  doctor!: DoctorDto;

  constructor(private userService: UserService, private authService: AuthenticationService,  private router: Router) {}

  ngOnInit() {
    this.userService.getConnectedUser().subscribe((data: DoctorDto) => {
      this.doctor = data;
    });
  }
  getSpecialityNames(doctor: DoctorDto): string {
    return doctor?.specialities?.map(s => s.name).join(', ') || 'Doctor';
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

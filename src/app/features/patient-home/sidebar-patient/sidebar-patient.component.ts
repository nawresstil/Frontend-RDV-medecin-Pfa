import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {AuthenticationService} from '../../login/services/authentification.service';
import {UserService} from '../../services/user.service';
import {PatientDto} from '../../../models/PatientDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar-patient',
  standalone: true,
  imports:[CommonModule, RouterModule],
  templateUrl: './sidebar-patient.component.html',
  styleUrl: './sidebar-patient.component.css'
})
export class SidebarPatientComponent implements OnInit {
  patient!: PatientDto;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getConnectedUser().subscribe((data: PatientDto) => {
      this.patient = data;
    });
  }

  calculateAge(dateOfBirth: Date | string): number {
    if (!dateOfBirth) return 0;
    const dob = new Date(dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
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

import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DoctorDto} from '../../../models/DoctorDto';
import {UserService} from '../../../features/services/user.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-doctors-admin',
  standalone:true,
  imports: [RouterModule, CommonModule],
  templateUrl: './doctors-admin.component.html',
  styleUrl: './doctors-admin.component.css'
})
export class DoctorsAdminComponent implements OnInit {
  doctors: DoctorDto[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getDoctors().subscribe((data) => {
      this.doctors = data;
    });
  }

  toggleStatus(doctor: DoctorDto): void {
    const isConfirmed = doctor.status === 'CONFIRMED';

    const toggle$ = isConfirmed
      ? this.userService.rejectDoctor(doctor.id)  // or cancelDoctor if you prefer
      : this.userService.acceptDoctor(doctor.id);

    toggle$.subscribe({
      next: () => {
        doctor.status = isConfirmed ? 'CANCELLED' : 'CONFIRMED';
      },
      error: (err) => {
        console.error('Failed to toggle doctor status:', err);
        // Optionally notify user or revert UI change here
      }
    });
  }



}

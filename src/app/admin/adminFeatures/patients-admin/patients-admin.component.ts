import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {UserService} from '../../../features/services/user.service';
import {PatientDto} from '../../../models/PatientDto';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-patients-admin',
  standalone:true,
  imports: [RouterModule, CommonModule],
  templateUrl: './patients-admin.component.html',
  styleUrl: './patients-admin.component.css'
})
export class PatientsAdminComponent implements OnInit {
  patients: PatientDto[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getPatients().subscribe((data) => {
      this.patients = data;
    });
  }
  calculateAge(dateOfBirth: Date | string): number {
    if (!dateOfBirth) return 0;
    const dob = new Date(dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}

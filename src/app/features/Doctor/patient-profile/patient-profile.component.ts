import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PatientDto } from '../../../models/PatientDto';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']  // fix typo from styleUrl to styleUrls
})
export class PatientProfileComponent implements OnInit {
  patient: PatientDto | null = null;
  patientId!: string;  // store patientId from route

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get patientId from route parameters
    this.patientId = this.route.snapshot.paramMap.get('patientId')!; // 'id' is route param name

    // Use patientId in the URL
    this.http.get<PatientDto>(`http://localhost:8083/user/${this.patientId}`).subscribe({
      next: (data) => {
        this.patient = data;
      },
      error: (err) => {
        console.error(err);
      }
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

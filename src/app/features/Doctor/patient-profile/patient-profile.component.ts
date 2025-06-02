import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PatientDto } from '../../../models/PatientDto';
import {Rdv} from '../../../models/rdv';
import {FormsModule} from '@angular/forms';
import {DoctorDto} from '../../../models/DoctorDto';
import {UserService} from '../../services/user.service';
import {Users} from '../../../models/users';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']  // fix typo from styleUrl to styleUrls
})
export class PatientProfileComponent implements OnInit {
  patient: PatientDto | null = null;
  doctor: DoctorDto | null = null;
  appointments: Rdv[] = [];
  patientId!: string;
  doctorId!: number;
  userC!: Users;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('patientId')!;

    // First get the connected user (doctor)
    this.userService.getConnectedUser().subscribe({
      next: (user: Users) => {
        this.userC = user;
        this.doctorId = user.id;

        // Load doctor details
        this.userService.getUserById(this.doctorId).subscribe({
          next: (doc: DoctorDto) => {
            this.doctor = doc;

            // Now load patient + appointments
            this.loadPatientAndAppointments();
          },
          error: (err) => console.error('Error fetching doctor info:', err)
        });
      },
      error: (err) => console.error('Error fetching connected user:', err)
    });
  }

  loadPatientAndAppointments(): void {
    this.http.get<PatientDto>(`http://localhost:8083/user/${this.patientId}`).subscribe({
      next: (data) => this.patient = data,
      error: (err) => console.error('Error fetching patient:', err)
    });

    this.http.get<Rdv[]>(`http://localhost:8083/rdv/patient/${this.patientId}`).subscribe({
      next: (data) => {
        this.appointments = data.filter(appt => appt.doctorId === this.doctorId);
      },
      error: (err) => console.error('Error fetching appointments:', err)
    });
  }


  calculateAge(dateOfBirth: Date | string): number {
    if (!dateOfBirth) return 0;
    const dob = new Date(dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  formatTime(time: string): string {
    return time ? time.slice(0, 5) : '';
  }

  openStatusModal(appt: any) {
    Swal.fire({
      title: 'Update Appointment Status',
      input: 'select',
      inputOptions: {
        CONFIRMED: 'Confirm',
        CANCELLED: 'Cancel'
      },
      inputPlaceholder: 'Select a status',
      showCancelButton: true,
      confirmButtonText: 'Update',
      inputValue: appt.status, // preselect current status
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newStatus = result.value;

        let url = '';
        if (newStatus === 'CONFIRMED') {
          url = `http://localhost:8083/rdv/${appt.id}/confirm`;
        } else if (newStatus === 'CANCELLED') {
          url = `http://localhost:8083/rdv/${appt.id}/cancel`;
        }

        if (url) {
          this.http.put(url, {}).subscribe(() => {
            this.appointments = this.appointments.filter(a => a.id !== appt.id);
            Swal.fire('Updated!', `Appointment marked as ${newStatus.toLowerCase()}.`, 'success');
          });
        }
      }
    });
  }

}

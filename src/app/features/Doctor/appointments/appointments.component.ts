import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { Users } from '../../../models/users';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  doctorId!: number;
  appointments: any[] = [];
  userC!: Users;

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.getConnectedUser();
  }

  getConnectedUser() {
    this.userService.getConnectedUser().subscribe((user: Users) => {
      this.userC = user;
      this.doctorId = user.id;
      this.fetchAppointments(); // Call after setting doctorId
    });
  }

  fetchAppointments() {
    this.http.get<any[]>(`http://localhost:8083/rdv/doctor/${this.doctorId}`).subscribe(rdvList => {
      const pendingRdv = rdvList.filter(rdv => rdv.status === 'PENDING');

      pendingRdv.forEach(rdv => {
        this.http.get<any>(`http://localhost:8083/user/${rdv.patientId}`).subscribe(patient => {
          this.appointments.push({
            ...rdv,
            patient
          });
        });
      });
    });
  }

  acceptAppointment(id: number) {
    Swal.fire({
      title: 'Confirm Appointment?',
      text: 'Are you sure you want to confirm this appointment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.put(`http://localhost:8083/rdv/${id}/confirm`, {}).subscribe(() => {
          this.appointments = this.appointments.filter(appt => appt.id !== id);
          Swal.fire('Confirmed!', 'The appointment has been confirmed.', 'success');
        });
      }
    });
  }

  cancelAppointment(id: number) {
    Swal.fire({
      title: 'Are you absolutely sure?',
      text: 'This action will cancel the appointment permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true,
      backdrop: true,
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.put(`http://localhost:8083/rdv/${id}/cancel`, {}).subscribe(() => {
          this.appointments = this.appointments.filter(appt => appt.id !== id);
          Swal.fire({
            title: 'Cancelled!',
            text: 'Appointment has been cancelled.',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }
}

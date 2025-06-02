import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Rdv} from '../../../models/rdv';
import {RdvService} from '../appointments/service/RdvService';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {PatientDto} from '../../../models/PatientDto';
import Swal from 'sweetalert2';
import {HttpClient} from '@angular/common/http';
import {Users} from '../../../models/users';
export interface AppointmentWithPatient extends Rdv {
  patient?: PatientDto;
}
@Component({
  selector: 'app-dashboard-doctor',
  standalone:true,
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './dashboard-doctor.component.html',
  styleUrl: './dashboard-doctor.component.css'
})

export class DashboardDoctorComponent implements OnInit {
  doctorId!: number;

  appointments: any[] = [];

  allAppointments: AppointmentWithPatient[] = [];
  todayAppointments: Rdv[] = [];

  totalPatients: number = 0;
  todayPatients: number = 0;
  AppointmentsCount: number = 0;

  maxPatients = 20;
  maxTodayPatients = 10;
  maxAppointments = 15;
  userC!: Users;

  constructor(private http: HttpClient,private RdvService: RdvService, private userService: UserService) {}

  ngOnInit() {
    this.getConnectedUser();
  }
  getConnectedUser() {
    this.userService.getConnectedUser().subscribe((user: Users) => {
      this.userC = user;
      this.doctorId = user.id;
      this.loadAppointments();

    });
  }
  loadAppointments() {
    this.RdvService.getAppointmentsByDoctorId(this.doctorId).subscribe((res) => {
      const appointmentsWithPatients: AppointmentWithPatient[] = res;

      const today = new Date();

      const confirmedPatientIds = new Set<number>();      // For total confirmed patients
      const todayConfirmedPatientIds = new Set<number>(); // For today confirmed patients
      let pendingAppointmentsCount = 0;

      appointmentsWithPatients.forEach((appt, index) => {
        // Count confirmed patients for "Total Patients"
        if (appt.status === 'CONFIRMED' && appt.patientId != null) {
          confirmedPatientIds.add(appt.patientId);
        }

        // Count pending appointments
        if (appt.status === 'PENDING') {
          pendingAppointmentsCount++;
        }

        // Count today's confirmed patients
        const apptDate = new Date(appt.date);
        const isToday =
          apptDate.getDate() === today.getDate() &&
          apptDate.getMonth() === today.getMonth() &&
          apptDate.getFullYear() === today.getFullYear();

        if (isToday && appt.status === 'CONFIRMED' && appt.patientId != null) {
          todayConfirmedPatientIds.add(appt.patientId);
        }

        // Fetch and attach patient info
        this.userService.getUserById(appt.patientId).subscribe((patient: PatientDto) => {
          appointmentsWithPatients[index].patient = patient;
        });
      });

      // Set correct counts
      this.totalPatients = confirmedPatientIds.size;
      this.todayPatients = todayConfirmedPatientIds.size;
      this.AppointmentsCount = pendingAppointmentsCount;

      // Sort appointments with PENDING first
      this.allAppointments = appointmentsWithPatients.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return 0;
      });
    });
  }

  formatTime(time: string): string {
    return time ? time.slice(0, 5) : '';
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

  filterTodayAppointments() {
    const today = new Date();

    this.todayAppointments = this.allAppointments.filter(appt => {
      const apptDate = new Date(appt.date);
      const isToday =
        apptDate.getDate() === today.getDate() &&
        apptDate.getMonth() === today.getMonth() &&
        apptDate.getFullYear() === today.getFullYear();

      return isToday;
    });

    this.todayPatients = this.todayAppointments.filter(appt => appt.status === 'CONFIRMED').length;
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

  getPercent(current: number, max: number): number {
    if (!max || max === 0) return 0;
    return Math.round((current / max) * 100);
  }

}

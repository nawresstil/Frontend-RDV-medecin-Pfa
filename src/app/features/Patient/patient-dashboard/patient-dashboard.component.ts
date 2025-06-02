import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Rdv} from '../../../models/rdv';
import {CommonModule} from '@angular/common';
import {PatientDto} from '../../../models/PatientDto';
import {DoctorDto} from '../../../models/DoctorDto';
import {RdvService} from '../../Doctor/appointments/service/RdvService';
import {UserService} from '../../services/user.service';
import {Users} from '../../../models/users';
import {forkJoin, map} from 'rxjs';
export interface AppointmentWithDoctor extends Rdv {
  doctor?: DoctorDto;
}
@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit {
  patientId!: number;
  userC!: Users;
  myAppointments: AppointmentWithDoctor[] = [];

  constructor(private rdvService: RdvService, private RdvService: RdvService, private userService: UserService) {}

  ngOnInit(): void {
    this.getConnectedUser();
  }
  getConnectedUser() {
    this.userService.getConnectedUser().subscribe((user: Users) => {
      this.userC = user;
      this.patientId = user.id;
      this.loadAppointments();

    });
  }
  loadAppointments(): void {
    this.RdvService.getAppointmentsByPatientId(this.patientId).subscribe((res: AppointmentWithDoctor[]) => {
      const fetchDoctorObservables = res.map((appt) => {
        return this.userService.getUserById(appt.doctorId).pipe(
          // Ajoute le docteur à l'objet rendez-vous
          // et retourne l'objet mis à jour
          map((doctor: DoctorDto) => {
            return { ...appt, doctor };
          })
        );
      });

      // Attendre que tous les appels à getUserById soient terminés
      forkJoin(fetchDoctorObservables).subscribe((updatedAppointments: AppointmentWithDoctor[]) => {
        this.myAppointments = updatedAppointments;
      });
    });
  }



  formatTime(time: string): string {
    return time ? time.slice(0, 5) : '';
  }
}

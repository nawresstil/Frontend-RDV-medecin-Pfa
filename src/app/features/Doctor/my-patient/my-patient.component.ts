import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {UserService} from '../../services/user.service';
import {HttpClient} from '@angular/common/http';
import {Users} from '../../../models/users';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-my-patient',
  standalone:true,
  imports: [RouterModule, CommonModule],
  templateUrl: './my-patient.component.html',
  styleUrl: './my-patient.component.css'
})
export class MyPatientComponent implements OnInit {
  doctorId!: number;
  confirmedAppointments: any[] = [];
  userC!: Users;

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.userService.getConnectedUser().subscribe((user: Users) => {
      this.userC = user;
      this.doctorId = user.id;
      this.fetchConfirmedAppointments();
    });
  }

  fetchConfirmedAppointments() {
    this.http.get<any[]>(`http://localhost:8083/rdv/doctor/${this.doctorId}`).subscribe((rdvList) => {
      const confirmedRdv = rdvList.filter((rdv) => rdv.status === 'CONFIRMED');
      this.confirmedAppointments = [];

      confirmedRdv.forEach((rdv) => {
        this.http.get<any>(`http://localhost:8083/user/${rdv.patientId}`).subscribe((patient) => {
          this.confirmedAppointments.push({
            ...rdv,
            patient,
          });
        });
      });
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

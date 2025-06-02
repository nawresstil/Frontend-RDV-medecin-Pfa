import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {UserService} from '../../services/user.service';
import {HttpClient} from '@angular/common/http';
import {Users} from '../../../models/users';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-my-patient',
  standalone:true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './my-patient.component.html',
  styleUrl: './my-patient.component.css'
})
export class MyPatientComponent implements OnInit {
  doctorId!: number;
  confirmedAppointments: any[] = [];
  filteredAppointments: any[] = [];
  searchTerm: string = '';
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
      const seenPatientIds = new Set<number>();
      this.confirmedAppointments = [];

      confirmedRdv.forEach((rdv) => {
        this.http.get<any>(`http://localhost:8083/user/${rdv.patientId}`).subscribe((patient) => {
          if (!seenPatientIds.has(patient.id)) {
            seenPatientIds.add(patient.id);
            const appt = { ...rdv, patient };
            this.confirmedAppointments.push(appt);
            this.filteredAppointments = [...this.confirmedAppointments];
          }
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

  filterPatients() {
    const term = this.searchTerm.toLowerCase();

    this.filteredAppointments = this.confirmedAppointments.filter(appt => {
      const fullName = `${appt.patient.firstname} ${appt.patient.lastname}`.toLowerCase();
      const blood = appt.patient.bloodGroup?.toLowerCase() || '';
      const age = this.calculateAge(appt.patient.dateOfBirth).toString();

      return (
        fullName.includes(term) ||
        blood.includes(term) ||
        age.includes(term)
      );
    });
  }
}

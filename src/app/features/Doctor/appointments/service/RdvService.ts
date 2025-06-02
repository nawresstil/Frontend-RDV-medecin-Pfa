// appointment.service.ts
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Rdv} from '../../../../models/rdv';
import {AuthenticationService} from '../../../login/services/authentification.service';
import {environment} from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RdvService {
  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  getAppointmentsByDoctorId(doctorId: number): Observable<Rdv[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.loadToken()
    });
    return this.http.get<Rdv[]>(environment.baseUrl+`/rdv/doctor/${doctorId}`,{headers});
  }

  getAppointmentsByPatientId(doctorId: number): Observable<Rdv[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.loadToken()
    });
    return this.http.get<Rdv[]>(environment.baseUrl+`/rdv/patient/${doctorId}`,{headers});
  }
}

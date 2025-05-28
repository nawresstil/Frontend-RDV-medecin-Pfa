import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../../../login/services/authentification.service';
import {RdvRequest} from '../../../../models/RdvRequest.models';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  bookAppointment(rdv: RdvRequest): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.loadToken()
    });
    return this.http.post(`${environment.baseUrl}/rdv/create`, rdv, { headers });
  }
}

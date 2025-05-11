import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {RegisterRequest} from '../../../../models/registerRequest';
import {AuthenticationResponse} from '../../../../models/authenticationResponse';
import {AuthenticationService} from '../../../login/services/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthDoctorService {

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  registerUser(registerRequest: RegisterRequest): Observable<AuthenticationResponse> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.loadToken() // optional if needed
    });

    return this.http.post<AuthenticationResponse>(
      `${environment.baseUrl}/auth/register`,
      registerRequest,
      { headers }
    );
  }
}

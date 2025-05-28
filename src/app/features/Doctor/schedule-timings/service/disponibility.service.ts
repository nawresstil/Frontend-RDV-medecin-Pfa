import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibility } from '../../../../models/disponibility.model';
import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from '../../../login/services/authentification.service';
import {DisponibilityDto} from '../../../../models/disponibilityDto.model';

@Injectable({
  providedIn: 'root',
})
export class DisponibilityService {
  private baseUrl = environment.baseUrl + '/disponibilities';

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.loadToken()
    });
  }

  getByDoctor(doctorId: number): Observable<Disponibility[]> {
    return this.http.get<Disponibility[]>(
      `${this.baseUrl}/doctor/${doctorId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  create(disponibility: Disponibility): Observable<Disponibility> {
    return this.http.post<Disponibility>(
      `${this.baseUrl}/create`,
      disponibility,
      { headers: this.getAuthHeaders() }
    );
  }

  update(id: number, disponibility: Disponibility): Observable<Disponibility> {
    return this.http.put<Disponibility>(
      `${this.baseUrl}/update/${id}`,
      disponibility,
      { headers: this.getAuthHeaders() }
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/delete/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }


  getDisponibilitiesByDoctor(doctorId: number): Observable<DisponibilityDto[]> {
    return this.http.get<DisponibilityDto[]>(
      `${this.baseUrl}/doctor/${doctorId}`,
      { headers: this.getAuthHeaders() }
    );
  }

}

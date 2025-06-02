// speciality.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Speciality} from '../../../../models/Speciality';
import {environment} from '../../../../../environments/environment';
import {AuthenticationService} from '../../../../features/login/services/authentification.service';

@Injectable({
  providedIn: 'root',
})
export class SpecialityService {
  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  getAllSpecialities(): Observable<Speciality[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.loadToken()
    });
    return this.http.get<Speciality[]>(environment.baseUrl+`/speciality/all`,{headers});
  }

  createSpeciality(formData: FormData): Observable<Speciality> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.loadToken()
    });
    return this.http.post<Speciality>(environment.baseUrl+`/speciality/create`, formData,{ headers });
  }

  updateSpeciality(id: number, formData: FormData): Observable<Speciality> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.loadToken()
    });
    return this.http.put<Speciality>(environment.baseUrl+`/speciality/update/${id}`, formData,{ headers });
  }

  deleteSpeciality(id: number): Observable<Speciality> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.loadToken()
    });
    return this.http.delete<Speciality>(environment.baseUrl+`/speciality/delete/${id}`,{headers});
  }
}

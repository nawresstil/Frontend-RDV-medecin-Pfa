import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {AuthenticationService} from '../../../login/services/authentification.service';
import {environment} from '../../../../../environments/environment';
import {DoctorDto} from '../../../../models/DoctorDto';


@Injectable({
  providedIn: 'root'
})
export class SearchDoctorsService {
  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  getAllDoctors(){
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.loadToken()
    });
    return this.http.get(environment.baseUrl+`/user/doctors`, { headers });
  }
  public getFormationById(id) {
    const headers = new HttpHeaders({Authorization: 'Bearer ' + this.authService.loadToken()});
    return this.http.get(environment.baseUrl +`/formation/${id}`,{headers} );
  }
}

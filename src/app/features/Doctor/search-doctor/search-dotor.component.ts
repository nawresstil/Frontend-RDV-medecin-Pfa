import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterModule} from '@angular/router';
import {DoctorDto} from '../../../models/DoctorDto';
import {SearchDoctorsService} from './services/searchDoctors.service';
import {FormBuilder} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-search-dotor',
  standalone:true,
  imports: [RouterModule,CommonModule],
  templateUrl: './search-dotor.component.html',
  styleUrl: './search-dotor.component.css'
})
export class SearchDotorComponent implements OnInit {
  public doctors: DoctorDto[] = [];

  constructor(
    private doctorService: SearchDoctorsService,
    private actvroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  getDoctors() {
    this.doctorService.getAllDoctors().subscribe({
      next: (response: DoctorDto[]) => {
        this.doctors = response;
      },
      error: (err) => {
        console.error('Error while getting doctors:', err);
      }
    });
  }
}

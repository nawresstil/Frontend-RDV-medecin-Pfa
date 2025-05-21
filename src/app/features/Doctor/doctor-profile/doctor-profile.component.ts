import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DoctorDto } from '../../../models/DoctorDto';
import { UserService } from '../../services/user.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.css'
})
export class DoctorProfileComponent implements OnInit {
  doctorId!: number;
  public doctor!: DoctorDto;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.doctorId = +this.route.snapshot.params['id'];
    this.userService.getDoctorById(this.doctorId).subscribe({
      next: (data: DoctorDto) => {
        console.log('Doctor data:', data); // ✅ Log data to console
        this.doctor = data;
      },
      error: (err) => {
        console.error('Error fetching doctor:', err); // Check for errors
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import {DoctorDto} from '../../../models/DoctorDto';

@Component({
  selector: 'app-sidebar-doctor',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar-doctor.component.html',
  styleUrl: './sidebar-doctor.component.css'
})
export class SidebarDoctorComponent implements OnInit {
  doctor!: DoctorDto;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getConnectedUser().subscribe((data: DoctorDto) => {
      this.doctor = data;
    });
  }
  getSpecialityNames(doctor: DoctorDto): string {
    return doctor?.specialities?.map(s => s.name).join(', ') || 'Doctor';
  }
}

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Speciality} from '../../../models/Speciality';
import {SpecialityService} from './service/SpecialityService';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import Swal from 'sweetalert2';
import {Users} from '../../../models/users';
import {UserService} from '../../../features/services/user.service';

@Component({
  selector: 'app-specialities-admin',
  standalone:true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './specialities-admin.component.html',
  styleUrl: './specialities-admin.component.css'
})
export class SpecialitiesAdminComponent implements OnInit {

  isModalOpen = false;
  specialities: Speciality[] = [];
  selectedFile: File | null = null;
  specialityForm!: FormGroup;
  userC!: Users;
  constructor(private specialityService: SpecialityService, private fb: FormBuilder, private userService: UserService,) {}

  ngOnInit(): void {
    this.userService.getConnectedUser().subscribe((data: Users) => {
      this.userC = data;
    });
    this.fetchSpecialities();

    this.specialityForm = this.fb.group({
      id: [null],
      name: [''],
      image: [null]
    });
  }

  fetchSpecialities() {
    this.specialityService.getAllSpecialities().subscribe((data) => {
      this.specialities = data;
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitSpeciality() {
    const formData = new FormData();
    formData.append('name', this.specialityForm.get('name')?.value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const id = this.specialityForm.get('id')?.value;

    const callback = () => {
      this.fetchSpecialities();
      this.closeModal();

      Swal.fire({
        icon: 'success',
        title: id ? 'Speciality updated!' : 'Speciality created!',
        showConfirmButton: false,
        timer: 1500
      });
    };

    if (id) {
      this.specialityService.updateSpeciality(id, formData).subscribe(callback, (error) => {
        Swal.fire('Error', 'Failed to update speciality', 'error');
      });
    } else {
      this.specialityService.createSpeciality(formData).subscribe(callback, (error) => {
        Swal.fire('Error', 'Failed to create speciality', 'error');
      });
    }
  }
  editSpeciality(speciality: Speciality) {
    this.specialityForm.patchValue({
      id: speciality.id,
      name: speciality.name,
      image: speciality.image
    });
    this.openModal(); // use programmatic open
  }
  deleteSpeciality(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.specialityService.deleteSpeciality(id).subscribe(() => {
          this.fetchSpecialities();
          Swal.fire('Deleted!', 'Speciality has been deleted.', 'success');
        }, (error) => {
          Swal.fire('Error', 'Failed to delete speciality', 'error');
        });
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.specialityForm.reset();
  }

}

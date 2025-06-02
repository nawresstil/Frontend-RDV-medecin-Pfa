import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {UserService} from '../../services/user.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DoctorDto} from '../../../models/DoctorDto';
import {PatientDto} from '../../../models/PatientDto';

@Component({
  selector: 'app-profile-patient-setting',
  standalone: true,
  imports: [RouterModule,CommonModule, ReactiveFormsModule, FormsModule,HttpClientModule],
  templateUrl: './profile-patient-setting.component.html',
  styleUrl: './profile-patient-setting.component.css'
})
export class ProfilePatientSettingComponent implements OnInit {
  patientForm: FormGroup;
  profilePicture: File | null = null;
  profilePicturePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getConnectedUser();
  }
  getConnectedUser(): void {
    this.userService.getConnectedUser().subscribe((user: PatientDto) => {
      this.initForm(user);
      this.profilePicturePreview = user.profilePicture;
    });
  }
  initForm(patient: PatientDto): void {
    this.patientForm = this.fb.group({
      id: [patient.id],
      firstname: [patient.firstname, Validators.required],
      lastname: [patient.lastname, Validators.required],
      dateOfBirth: [new Date(patient.dateOfBirth).toISOString().substring(0, 10)],
      email: [patient.email, [Validators.required, Validators.email]],
      phone: [patient.phone, Validators.required],
      address: [patient.address],
      city: [patient.city],
      state: [patient.state],
      zipCode: [patient.zipCode],
      country: [patient.country],
      username: [patient.username],
      joiningDate: [patient.joiningDate],
      bloodGroup: [patient.bloodGroup],
      oldPassword: [''],
      password: [''],
      confirmPassword: ['']
    });
  }

  onProfilePictureChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.profilePicture = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicturePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required fields before submitting.',
      });
      return;
    }

    const patientDto = {
      ...this.patientForm.value
    };
    console.log('Full DTO:', patientDto);

    const formData = new FormData();
    formData.append('patientDto', JSON.stringify(patientDto));

    if (this.profilePicture) {
      formData.append('profilePicture', this.profilePicture);
    }

    this.http.put('http://localhost:8083/user/patient/profile', formData).subscribe({
      next: (response) => {
        console.log('Success', response),
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile has been updated successfully!',
          });
      },
      error: (error) => {
        console.error('Error', error),

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Something went wrong while updating your profile.',
          });
        console.error('Update error:', error);

      }
    });
  }
  get services(): FormArray {
    return this.patientForm.get('services') as FormArray;
  }
}

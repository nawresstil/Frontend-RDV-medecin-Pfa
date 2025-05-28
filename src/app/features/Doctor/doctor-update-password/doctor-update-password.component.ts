import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import Swal from 'sweetalert2';
import {HttpClient} from '@angular/common/http';
import {DoctorDto} from '../../../models/DoctorDto';
import {UserService} from '../../services/user.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-doctor-update-password',
  standalone:true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule], // <-- Add CommonModule here
  templateUrl: './doctor-update-password.component.html',
  styleUrl: './doctor-update-password.component.css'
})
export class DoctorUpdatePasswordComponent implements OnInit {
  doctorForm: FormGroup;
  doctorProfile: DoctorDto | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getConnectedUser();
  }

  getConnectedUser(): void {
    this.userService.getConnectedUser().subscribe((user: DoctorDto) => {
      this.doctorProfile = user;
      this.initForm(user);
    });
  }

  initForm(user: DoctorDto): void {
    this.doctorForm = this.fb.group({
      firstname: [user.firstname],
      lastname: [user.lastname],
      dateOfBirth: [new Date(user.dateOfBirth).toISOString().substring(0, 10)],
      email: [user.email],
      phone: [user.phone],
      address: [user.address],
      city: [user.city],
      state: [user.state],
      zipCode: [user.zipCode],
      country: [user.country],
      joiningDate: [user.joiningDate],
      username: [user.username],
      id: [user.id],
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      gender: [user.gender],
      aboutMe: [user.aboutMe],
      biography: [user.biography],
      clinicName: [user.clinicName],
      clinicAddress: [user.clinicAddress],
      clinicContact: [user.clinicContact],
      free: [user.isFree],
      customPrice: [user.customPrice],
      services: [user.services],
      specialityIds: [user.specialityIds],
      education: this.fb.array(user.education.map(e => this.fb.group({
        degree: [e.degree],
        institute: [e.institute],
        yearOfCompletion: [e.yearOfCompletion]
      }))),

      experience: this.fb.array(user.experience.map(e => this.fb.group({
        hospitalName: [e.hospitalName],
        fromDate: [e.fromDate],
        toDate: [e.toDate],
        designation: [e.designation]
      }))),

      awards: this.fb.array(user.awards.map(a => this.fb.group({
        name: [a.name],
        year: [a.year]
      })))
    }, {
      validators: this.passwordMatchValidator()
    });
  }

  passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    };
  }

  onSubmit(): void {
    if (this.doctorForm.valid && this.doctorProfile) {
      const formValue = this.doctorForm.value;

      // Build full DoctorDto from the form values
      const updatedDoctor: DoctorDto = {
        ...formValue,
        id: this.doctorProfile.id, // Ensure correct ID
        username: this.doctorProfile.username, // Keep consistent username
        oldPassword: formValue.oldPassword,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword
      };

      const formData = new FormData();
      formData.append('doctorDto', JSON.stringify(updatedDoctor));

      this.http.put('http://localhost:8083/user/doctor/profile', formData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Mot de passe mis à jour',
            text: 'Votre mot de passe a été mis à jour avec succès.',
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Échec de la mise à jour',
            text: error.error?.message || 'Une erreur est survenue lors de la mise à jour du mot de passe.',
          });
        }
      });
    } else {
      this.doctorForm.markAllAsTouched();
    }
  }



  get oldPassword() { return this.doctorForm.get('oldPassword'); }
  get password() { return this.doctorForm.get('password'); }
  get confirmPassword() { return this.doctorForm.get('confirmPassword'); }
}

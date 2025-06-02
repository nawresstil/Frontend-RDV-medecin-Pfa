import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {PatientDto} from '../../../models/PatientDto';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  standalone:true,
  imports: [RouterModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  // @ts-ignore
  patientForm: FormGroup;
  patientProfile: PatientDto | null = null;

  // @ts-ignore
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getConnectedUser();
  }

  getConnectedUser(): void {
    this.userService.getConnectedUser().subscribe((user: PatientDto) => {
      this.patientProfile = user;
      this.initForm(user);
    });
  }

  initForm(user: PatientDto): void {
    this.patientForm = this.fb.group({
      id: [user.id],
      firstname: [user.firstname, Validators.required],
      lastname: [user.lastname, Validators.required],
      dateOfBirth: [new Date(user.dateOfBirth).toISOString().substring(0, 10)],
      email: [user.email, [Validators.required, Validators.email]],
      phone: [user.phone, Validators.required],
      address: [user.address],
      city: [user.city],
      state: [user.state],
      zipCode: [user.zipCode],
      country: [user.country],
      username: [user.username],
      joiningDate: [user.joiningDate],
      bloodGroup: [user.bloodGroup],
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
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
    if (this.patientForm.valid && this.patientProfile) {
      const formValue = this.patientForm.value;

      const updatedPatient: PatientDto = {
        id: this.patientProfile.id, // Ensure correct ID
        ...formValue,
        oldPassword: formValue.oldPassword,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword
      };

      const formData = new FormData();
      formData.append('patientDto', JSON.stringify(updatedPatient));

      this.http.put('http://localhost:8083/user/patient/profile', formData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Password Updated',
            text: 'Your password has been changed successfully.'
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: err.error?.message || 'An error occurred while updating your password.'
          });
        }
      });
    } else {
      this.patientForm.markAllAsTouched();
    }
  }

  get oldPassword() { return this.patientForm.get('oldPassword'); }
  get password() { return this.patientForm.get('password'); }
  get confirmPassword() { return this.patientForm.get('confirmPassword'); }
}

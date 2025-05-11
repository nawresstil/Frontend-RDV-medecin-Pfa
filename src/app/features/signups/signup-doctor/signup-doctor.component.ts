import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {RegisterRequest} from '../../../models/registerRequest';
import {HttpClientModule} from '@angular/common/http';
import {AuthDoctorService} from './services/authDoctor.service';


@Component({
  selector: 'app-signup-doctor',
  templateUrl: './signup-doctor.component.html',
  styleUrls: ['./signup-doctor.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
})
export class SignupDoctorComponent {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthDoctorService, private router: Router) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      if (formValue.password !== formValue.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

      const registerRequest: RegisterRequest = {
        ...formValue,
        role: 'DOCTOR',
        joiningDate: today
      };

      this.authService.registerUser(registerRequest).subscribe({
        next: (res) => this.router.navigate(['/signin']),
        error: (err) => {
          console.error(err);
          alert('Registration failed');
        }
      });
    }
  }
}

import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {RegisterRequest} from '../../../models/registerRequest';
import { HttpClientModule } from '@angular/common/http';
import {AuthPatientService} from './services/authPatient.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authPatientService: AuthPatientService, private router: Router) {
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
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      if (formValue.password !== formValue.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      const today = new Date().toISOString().split('T')[0]; // Format: yyyy-mm-dd

      const registerRequest: RegisterRequest = {
        ...formValue,
        role: 'PATIENT',
        joiningDate: today
      };

      this.authPatientService.registerUser(registerRequest).subscribe({
        next: (res) => this.router.navigate(['/signin']),
        error: (err) => {
          console.error(err);
          alert('Registration failed');
        }
      });
    }
  }
}

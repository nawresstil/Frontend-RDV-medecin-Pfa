import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from '../../login/services/authentification.service';
import {UserService} from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  forgetForm: FormGroup;
  constructor(private authService: AuthenticationService, private route: ActivatedRoute, private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService) {}
  ngOnInit() {
    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  resetPassword() {
    if (this.forgetForm.valid) {
      this.userService.forgotPassword(this.forgetForm.value).subscribe(
        (response) => {
          Swal.fire('Success!', 'Password reset email sent successfully.', 'success')
            .then(() => {
              this.router.navigate(['/signin']);  // Redirect after OK clicked
            });
        },
        (error) => {
          if (error.status === 404) {
            // Assuming 404 means email not found
            Swal.fire('Error!', 'Email address not found.', 'error');
          } else {
            Swal.fire('Error!', 'An unexpected error occurred. Please try again.', 'error');
          }
        }
      );
    } else {
      Swal.fire('Error!', 'Please enter a valid email.', 'warning');
    }
  }

  get f() {
    return this.forgetForm.controls;
  }

}

import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {UserService} from '../services/user.service';
import Swal from 'sweetalert2';
import {HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from './services/authentification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit {
  message: string;
  loginForm: FormGroup;
  submit = false;
  forgetForm: FormGroup;

  constructor(private authService: AuthenticationService, private route: ActivatedRoute, private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService) {}

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  onLogin() {
    this.submit = true;
    this.authService.login(this.loginForm.value).subscribe((rep : any) => {
      const jwt = rep.body.token;
      if (jwt) {
        this.authService.saveToken(jwt);
      }
      this.router.navigateByUrl('/home/features/dashboard');
    }, error1 => {
      Swal.fire('Error ! ' , 'Check your data ! ');
    });
  }

}

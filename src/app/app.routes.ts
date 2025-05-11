import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {ContainerComponent} from './home/container/container.component';
import {DoctorHomeComponent} from './features/doctor-home/doctor-home.component';
import {DashboardDoctorComponent} from './features/Doctor/dashboard-doctor/dashboard-doctor.component';
import {PatientHomeComponent} from './features/patient-home/patient-home.component';
import {DoctorProfileComponent} from './features/Doctor/doctor-profile/doctor-profile.component';
import {AdminHomeComponent} from './admin/admin-home/admin-home.component';
import {DashboardAdminComponent} from './admin/adminFeatures/dashboard-admin/dashboard-admin.component';
import {LoginComponent} from './features/login/login.component';
import {SignUpComponent} from './features/signups/sign-up/sign-up.component';
import {SignupDoctorComponent} from './features/signups/signup-doctor/signup-doctor.component';
import {ResetPasswordComponent} from './features/signups/reset-password/reset-password.component';

export const APP_ROUTE: Route[] = [
  {path: 'signin', component: LoginComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'signupDoctor', component: SignupDoctorComponent},
  {path: 'resetPassword', component: ResetPasswordComponent},
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {path: 'signin_signup', component: LoginComponent},
      {path: '', component: ContainerComponent},
      { path: 'doctor-profile', component: DoctorProfileComponent },
      {path: 'doctor', component: DoctorHomeComponent, children: [
          {path: '', component: DashboardDoctorComponent},
          {
            path: 'features',
            loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule)
          },
        ]
      },
      {path: 'patient', component: PatientHomeComponent,
        children: [
          {path: '', component: DashboardDoctorComponent},
          {
            path: 'features',
            loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule)
          },
        ]
      },
      {
        path: 'features',
        loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule)
      },
    ]
  },
  {path: 'admin',
  component: AdminHomeComponent,
  children: [
  {path: '', component: DashboardAdminComponent},
    {
      path: 'featuresAdmin',
      loadChildren: () => import('./admin/adminFeatures/features-admin.module').then(m => m.FeaturesAdminModule)
    },
    ],
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

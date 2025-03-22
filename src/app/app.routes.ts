import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {ContainerComponent} from './home/container/container.component';
import {SearchDotorComponent} from './features/Doctor/search-doctor/search-dotor.component';
import {DoctorHomeComponent} from './features/doctor-home/doctor-home.component';
import {DashboardDoctorComponent} from './features/Doctor/dashboard-doctor/dashboard-doctor.component';
import {PatientDashboardComponent} from './features/Patient/patient-dashboard/patient-dashboard.component';
import {PatientProfileComponent} from './features/Doctor/patient-profile/patient-profile.component';

export const APP_ROUTE: Route[] = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {path: '', component: ContainerComponent},
      {path: 'doctor', component: DoctorHomeComponent,
        children: [
          {path: '', component: DashboardDoctorComponent},
          {
            path: 'features',
            loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule)
          },
        ]
      },
      {path: 'patient', component: PatientDashboardComponent,
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
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

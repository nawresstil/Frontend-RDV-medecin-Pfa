import { Component } from '@angular/core';
import { RouterModule} from '@angular/router';
import {TopbarComponent} from './topbar/topbar.component';
import {FooterComponent} from './footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,TopbarComponent,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

import { Component } from '@angular/core';
import { RouterModule, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common'; // Import TopbarComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'FrontPFA';
}

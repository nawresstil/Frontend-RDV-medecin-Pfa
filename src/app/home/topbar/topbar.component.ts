import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({

  selector: 'app-topbar',
  standalone: true,
  imports:[CommonModule, RouterModule,RouterLink],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  activeUrl: string = '';
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeUrl = event.urlAfterRedirects;
      }
    });
  }

  isActive(url: string): boolean {
    return this.activeUrl.includes(url);
  }
  navigateTo(link: string) {
    this.router.navigateByUrl(link);
  }

  ngOnInit() {
  }
}

import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {UserService} from '../../features/services/user.service';
import {Users} from '../../models/users';

@Component({

  selector: 'app-topbar',
  standalone: true,
  imports:[CommonModule, RouterModule,RouterLink],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  public userC: Users;

  activeUrl: string = '';
  constructor(private router: Router, private userService: UserService) {
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

    this.userService.getConnectedUser().subscribe(
      (response: Users) => {
        this.userC = response;
      });
  }
}

import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterLink, RouterModule} from '@angular/router';

@Component({
  selector: 'app-container',
  standalone: true,
  imports:[CommonModule, RouterModule,RouterLink],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})
export class ContainerComponent implements OnInit {
  constructor(private router: Router) {
    this.router.events.subscribe(event => {

    });
  }



  ngOnInit() {
  }
}

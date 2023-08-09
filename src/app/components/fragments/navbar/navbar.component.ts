import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  navs = ['home', 'messages', 'alerts', 'settings', 'profile'];
  activePage = 'none';

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.activePage = this.router.url.split('/')[1];
  }

}

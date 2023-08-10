import { Component, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

type Navs = typeof NavbarComponent.prototype.navs[number]

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  navs = ['home', 'messages', 'alerts', 'settings', 'profile'] as const;
  activePage: Navs | undefined;
  activeMarkerPos = '0';

  constructor(
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.activePage = this.router.url.split('/')[1].split('?')[0] as Navs;
    let index = this.navs.indexOf(this.activePage)
    if(index === -1){
      index = 0;
      this.activePage = 'home'
    }
    this.activeMarkerPos = `${index * 70}px`
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        this.activePage = event.url.split('/')[1].split('?')[0] as Navs;
        this.activeMarkerPos = `${this.navs.indexOf(this.activePage) * 70}px`
      }
    });
  }

}

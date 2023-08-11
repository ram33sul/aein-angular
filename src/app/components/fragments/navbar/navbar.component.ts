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
  showActiveMarker = false;

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    this.setActiveMarkerPos(this.router.url)
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        this.setActiveMarkerPos(event.url)
      }
    });
  }

  setActiveMarkerPos(url: string) {
    this.activePage = url.split('/')[1].split('?')[0] as Navs;
    let index = this.navs.indexOf(this.activePage)
    if(!this.activePage){
      index = 0;
      this.activePage = 'home'
    }
    this.activeMarkerPos = `${index * 70}px`
    if(index > -1){
      this.showActiveMarker = true;
    } else {
      this.showActiveMarker = false;
    }
  }

}

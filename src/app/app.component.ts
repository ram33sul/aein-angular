import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MessageService } from './services/messages/message.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'aein-angular';
  showNavbar = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        const path = event.url.split('/')[1];
        if(!["login", "signup"].includes(path)){
          this.showNavbar = true;
        } else {
          this.showNavbar = false;
        }
      }
    })
  }
}

import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { UserData } from 'src/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnDestroy {

  userData: UserData | null = null;
  loading = true;
  routerSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    protected userService: UserService
  ) {}

  ngOnInit() {
    this.updateUserData(this.router.url)
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.updateUserData(event.url)
      }
    })
  }

  updateUserData(url: string) {
    const userId = url.split('userId=')[1]?.split('&')[0];
    if(!userId || userId === this.userService.userData?._id){
      this.userData = this.userService.userData;
      this.loading = false;
      return;
    }
    this.routerSubscription = this.userService.getUserDetails(userId).subscribe((response) => {
      this.userData = response;
      this.loading = false;
    })
  }

  ngOnDestroy(){
    this.routerSubscription?.unsubscribe();
  }
}

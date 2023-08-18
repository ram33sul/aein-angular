import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/messages/message.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
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
  followLoading = false;
  shareSearch = '';
  shareSearchResult: UserData[] = [];
  isShareVisible = false;

  constructor(
    private router: Router,
    protected userService: UserService,
    private profileService: ProfileService,
    private messageService: MessageService
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
  
  handleFollow(){
    if(this.userData){
      this.followLoading = true;
      this.profileService.follow(this.userData?._id).subscribe((response) => {
        this.userService.userData = response
        this.followLoading = false;
      })
    }
  }

  handleUnfollow(){
    if(this.userData){
      this.followLoading = true;
      this.profileService.unfollow(this.userData?._id).subscribe((response) => {
        this.userService.userData = response;
        this.followLoading = false;
      })
    }
  }

  handleShareSearch(search: string) {
    this.shareSearch = search;
    this.profileService.getUsersList(search).subscribe({
      next: response => {
        this.shareSearchResult = response.users
      }
    })
  }

  handleShare(){
    this.isShareVisible = !this.isShareVisible;
  }

  shareProfile(userId: string) {
    const ws = this.messageService.messageWs;
    if(ws && ws.OPEN){
      ws.send(JSON.stringify({
        type: "share",
        userId: this.userService.userData?._id,
        toUserId: userId,
        content: this.userData?._id,
        messageType: "profile"
      }))
    }
  }

  handleLogout() {
    this.userService.logout()
  }
}

import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserData } from 'src/interfaces/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  userData: UserData | null = null;
  loading = true;
  profileImage = null;
  size = 80;

  constructor(
    private userService: UserService,
    private router: Router,
    private profileService: ProfileService
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
    this.userService.getUserDetails(userId).subscribe((response) => {
      this.userData = response;
      this.loading = false;
    })
  }

  handleCancel() {
    this.router.navigateByUrl('profile')
  }

  handleSave() {
    console.log(this.profileImage)
    if(this.userData){
      const formData = new FormData();
      if(this.profileImage){
        formData.append("image", this.profileImage);
      }
      formData.append("name", this.userData.name);
      formData.append("username", this.userData.username);
      formData.append("bio", this.userData.bio);
      this.profileService.editUserProfile(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('profile')
        }
      })
    }
  }
}

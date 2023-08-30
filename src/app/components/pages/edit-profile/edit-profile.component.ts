import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  name = new FormControl('',[Validators.required]);
  bio = new FormControl('', [Validators.maxLength(200)]);
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
      this.name.setValue(this.userData?.name ?? "")
      this.bio.setValue(this.userData?.bio ?? "");
      this.loading = false;
      return;
    }
    this.userService.getUserDetails(userId).subscribe((response) => {
      this.userData = response;
      this.name.setValue(this.userData?.name ?? "")
      this.bio.setValue(this.userData?.bio ?? "");
      this.loading = false;
    })
  }

  handleCancel() {
    this.router.navigateByUrl('profile')
  }

  handleSave() {
    if(this.userData){
      const formData = new FormData();
      if(this.profileImage){
        formData.append("image", this.profileImage);
      }
      formData.append("name", this.name.value ?? "");
      formData.append("username", this.userData.username);
      formData.append("bio", this.bio.value ?? "");
      this.profileService.editUserProfile(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('profile')
        }
      })
    }
  }
}

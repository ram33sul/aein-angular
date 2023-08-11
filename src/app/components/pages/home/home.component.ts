import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { UserData } from 'src/interfaces/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  searchResults: UserData[] = [];
  showSearchResults = false
  searchLoading = false;

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  handleSearch(keyword: string) {
    keyword = keyword.trim()
    if(keyword){
      this.showSearchResults = true;
      this.searchLoading = true;
      this.profileService.getUsersList(keyword).subscribe((response) => {
        this.searchResults = response.users;
        this.searchLoading = false;
      })
    } else {
      this.showSearchResults = false;
      this.searchResults = [];
    }
  }

  navigateToProfile(userId: string){
    this.router.navigateByUrl(`profile?userId=${userId}`)
  }

}

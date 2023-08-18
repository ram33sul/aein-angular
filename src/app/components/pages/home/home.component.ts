import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/posts/post.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { Post } from 'src/interfaces/post';
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
  posts: Post[] = [];
  PostsLoading = true;
  PostsError = '';

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: response => {
        this.posts = response;
        this.PostsLoading = false;
      },
      error: response => {
        this.PostsError = "Unable to load posts"
        this.PostsLoading = false;
      }
    })
  }

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

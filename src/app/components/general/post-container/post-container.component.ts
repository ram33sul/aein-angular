import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/posts/post.service';
import { UserService } from 'src/app/services/user/user.service';
import { Post } from 'src/interfaces/post';
import { UserData } from 'src/interfaces/user';

@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.css']
})
export class PostContainerComponent {
  @Input() post!: Post;
  userData: UserData | null = null;
  userDataError = '';
  withUserData: UserData | null = null;
  withUserDataError = '';
  loading = true;
  error = '';

  constructor(
    protected userService: UserService,
    private postService: PostService,
    private router: Router
  ){}

  ngOnInit() {
    this.userService.getUserDetails(this.post.userId).subscribe({
      next: response => {
        this.userData = response;
        this.checkLoading()
      },
      error: error => {
        this.userDataError = 'Something went wrong';
        this.checkLoading()
      }
    });
    this.userService.getUserDetails(this.post.withUserId).subscribe({
      next: response => {
        this.withUserData = response;
        this.checkLoading()
      },
      error: error =>{
        this.withUserDataError = "something went wrong";
        this.checkLoading()
      }
    })
  }

  checkLoading() {
    if(this.userData && this.withUserData){
      this.loading = false;
    }
    if(this.userDataError || this.withUserDataError){
      this.error = "Something went wrong"
    }
  }

  navigateToProfile(userId: string){
    this.router.navigateByUrl(`profile?userId=${userId}`)
  }

  navigateToPostDetails() {
    this.router.navigateByUrl(`post-details?postId=${this.post._id}`)
  }

  handleLike(){
    if(this.post.likes.includes(this.userService.userData?._id ?? '')){
      this.onUnlike()
    } else {
      this.onLike()
    }
  }

  handleDislike() {
    if(this.post.dislikes.includes(this.userService.userData?._id ?? '')){
      this.onUndislike()
    } else {
      this.onDislike()
    }
  }

  onLike() {
    if(!this.userService.userData?._id) return;
    this.postService.likePost({userId: this.userService.userData._id ?? '', postId: this.post._id}).subscribe({
      next: reponse => {
        this.post.likes.push(this.userService.userData?._id ?? '')
      },
      error: error => {
        
      }
    })
  }

  onDislike() {
    if(!this.userService.userData?._id) return;
    this.postService.dislikePost({userId: this.userService.userData._id ?? '', postId: this.post._id}).subscribe({
      next: response => {
        this.post.dislikes.push(this.userService.userData?._id ?? '')
      },
      error: error => {
        
      }
    })
  }

  onUnlike() {
    if(!this.userService.userData?._id) return;
    this.postService.unlikePost({userId: this.userService.userData._id ?? '', postId: this.post._id}).subscribe({
      next: response => {
        this.post.likes = this.post.likes.filter(like => like !== this.userService.userData?._id ?? '');
      },
      error: error => {
        
      }
    })
  }

  onUndislike() {
    if(!this.userService.userData?._id) return;
    this.postService.undislikePost({userId: this.userService.userData._id ?? '', postId: this.post._id}).subscribe({
      next: response => {
        this.post.dislikes = this.post.dislikes.filter(like => like !== this.userService.userData?._id ?? '');
      },
      error: error => {
        
      }
    })
  }

  onReplyClick() {
    this.router.navigateByUrl(`post-details?postId=${this.post._id}&page=reply`)
  }
}

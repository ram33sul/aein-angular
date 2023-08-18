import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PostService } from 'src/app/services/posts/post.service';
import { UserService } from 'src/app/services/user/user.service';
import { Comment, Post, Reply } from 'src/interfaces/post';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent {

  post: Post | null = null;
  loading = true;
  comments: Comment[] = [];
  commentsLoading = true;
  replies: Reply[] = [];
  repliesLoading = true;
  isRepliesPage = false;
  comment = '';
  reply = ''

  @ViewChild("scrollContainer") private scrollContainer!: ElementRef;

  constructor (
    private postService: PostService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.updatePostData(this.router.url);
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.updatePostData(event.url);
      }
    })
  }

  updatePostData(url: string) {
    this.loading = true;
    const postId = url.split('postId=')[1]?.split('&')[0];
    this.isRepliesPage = url.split('page=')[1]?.split('&')[0] === 'reply';
    this.postService.getPostDetails(postId).subscribe({
      next: response => {
        this.post = response
        this.loading = false
      },
      error: error => {
        this.loading = false
      }
    })
    this.postService.getComments(postId).subscribe({
      next: response => {
        this.comments = response
        this.commentsLoading = false;
      },
      error: error => {
        console.log(error)
        this.commentsLoading = false
      }
    })
    this.postService.getReplies(postId).subscribe({
      next: response => {
        this.replies = response
        this.repliesLoading = false;
      },
      error: error => {
        console.log(error)
        this.repliesLoading = false
      }
    })
  }

  addComment() {
    const commentData = {
      content: this.comment,
      userId: this.userService.userData?._id ?? "",
      postId: this.post?._id ?? ""
    }
    this.postService.postComment(commentData).subscribe({
      next: response => {
        this.comments.push(commentData)
        if(this.post?.commentsCount){
          this.post.commentsCount += 1
        }
        this.comment = ''
      }
    })
  }

  addReply() {
    const replyData = {
      content: this.reply,
      userId: this.userService.userData?._id ?? "",
      postId: this.post?._id ?? "",
      mood: 'none'
    }
    this.postService.sendReply(replyData).subscribe({
      next: response => {
        this.replies.push(replyData)
        console.log(this.replies)
        if(this.post?.repliesCount){
          this.post.repliesCount += 1;
        }
        this.reply = '';
      }
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom()
  }
  
  scrollToBottom() {
    const element = this.scrollContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}

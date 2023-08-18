import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { Comment } from 'src/interfaces/post';
import { UserData } from 'src/interfaces/user';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment!: Comment;
  userData: UserData | null = null;
  userDataLoading = true;

  constructor (
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getUserDetails(this.comment.userId).subscribe({
      next: response => {
        this.userData = response;
        this.userDataLoading = false;
      },
      error: error => {
        this.userDataLoading = false;
      }
    })
  }

  navigateToProfile(userId: string){
    this.router.navigateByUrl(`profile?userId=${userId}`)
  }
}

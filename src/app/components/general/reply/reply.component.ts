import { Component, Input } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Reply } from 'src/interfaces/post';
import { UserData } from 'src/interfaces/user';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent {
  @Input() reply!: Reply;
  userData: UserData | null = null;

  constructor (
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserDetails(this.reply.userId).subscribe({
      next: response => {
        this.userData = response
      },
    })
  }
}

import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { Message } from 'src/interfaces/message';
import { UserData } from 'src/interfaces/user';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnChanges {
  @Input() message!: Message;
  @Input() active = false;
  @Input() sendUser!: string | undefined;
  @Output() onClick = new EventEmitter();

  type: 'send' | 'recieve' = 'send';
  userData: UserData | null = null;
  userDataLoading = true;
  backgroundColor = '';
  color = '';

  @HostBinding('class.active') activeClass = false;
  constructor(
    protected userService: UserService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges){
    if(changes['active']){
      this.activeClass = this.active
    }
  }



  ngOnInit() {
    if(this.sendUser === this.message.to){
      this.type = 'recieve';
      this.color = this.message.mood?.color ?? ''
    } else {
      this.backgroundColor = this.message.mood?.color ?? ''
    }
    if(this.message.type === 'profile'){
      this.userService.getUserDetails(this.message.content).subscribe((response) => {
        this.userData = response;
        this.userDataLoading = false;
      })
    }
  }

  handleProfileClick(userId: string) {
    this.router.navigateByUrl(`/profile?userId=${userId}`)
  }
}

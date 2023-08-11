import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messageWs: WebSocket | null = null;

  constructor(
  ) { }

  connectMessagesWs(token: string) {
    this.messageWs = new WebSocket(`ws://127.0.0.1:5001?token=${token}`)
  }

}

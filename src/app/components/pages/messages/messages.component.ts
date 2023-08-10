import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MessageService } from 'src/app/services/messages/message.service';
import { UserService } from 'src/app/services/user/user.service';
import { Message, OverallMessage, Mood } from 'src/interfaces/message';
import { UserData } from 'src/interfaces/user';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent {

  overallMessages: OverallMessage[] = [];
  overallMessagesLoading = true;
  messageData: Message[] = [];
  messageDataLoading = true;
  userData: UserData | null = null;
  userDataLoading = true;
  error = '';
  userId = '';
  message = '';
  moods: Mood[] = [];
  currentMood : Mood | null = null;
  sendLoading = false;
  scrollBehavior = 'auto';
  isOnline: boolean = false;
  isOnlineLoading = true;

  constructor(
    private messageService: MessageService,
    protected userService: UserService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  @ViewChild('messagesWrapper', {static: true}) messagesWrapper!: ElementRef;

  ngOnInit() {
    this.setUpWebSocket();
    this.subscribeToRouterEvents();
  }

  ngAfterViewChecked() {
    this.scroll();
  }

  setUpWebSocket() {
    this.messageService.connectMessagesWs()
    const ws = this.messageService.messageWs;
    if(ws){
      ws.onopen = this.handleWebSocketOpen.bind(this);
      ws.onmessage = this.handleWebSocketMessage.bind(this);
      ws.onerror = this.handleWebSocketError.bind(this);
      ws.onclose = this.handleWebSocketClose.bind(this);
    }
  }

  subscribeToRouterEvents() {
    this.userId = this.router.url.split('userId=')[1]?.split('&')[0]
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        this.userId = event.url.split('userId=')[1]?.split('&')[0]
        this.retrieveUserMessages()
      }
    })
  }

  handleWebSocketOpen() {
    this.retrieveUserMessages()
    this.retrieveOverallMessages()
    this.getMoods();
  }

  retrieveUserMessages(){
    const ws = this.messageService.messageWs;
    if(this.userId && ws){
      ws?.send(
        JSON.stringify({
          from: this.userService.userData?._id,
          to: this.userId,
          markSeen: {
            viewedUser: this.userService.userData?._id,
            sendUser: this.userId
          },
          type: 'getMessages'
        })
      )
    } else {
      this.messageDataLoading = false;
    }
    this.userDataLoading = true
    this.userService.getUserDetails(this.userId).subscribe((response) => {
      this.userData = response;
      this.userDataLoading = false;
    })
    this.checkOnlineStatus();
  }

  retrieveOverallMessages() {
    const ws = this.messageService.messageWs;
    if(ws){
      ws?.send(
        JSON.stringify({
          userId: this.userService.userData?._id,
          type: 'getOverallMessages',
        })
      );
    }
  }

  getMoods() {
    const ws = this.messageService.messageWs;
    if(ws){
      ws.send(
        JSON.stringify({
          userId: this.userService.userData?._id,
          type: 'getMoods'
        })
      )
    }
  }

  handleWebSocketMessage(res: MessageEvent) {
    const response: { type: string; data: unknown, messageData: unknown, isOnline: boolean } = JSON.parse(res.data);
    if(response.type === 'getOverallMessages') return this.handleGetOverallMessages(response.data as OverallMessage[])
    if(response.type === 'getMessages') return this.handleGetMessages(response.messageData as Message[])
    if(response.type === 'getMoods') return this.handleGetMoods(response.messageData as Mood[])
    if(response.type === 'sendMessage') return this.handleSendMessages(response.data as Message)
    if(response.type === 'isOnline') return this.handleIsOnline(response.isOnline);
  }

  sendMessage() {
    const message = this.message.trim()
    if(!message) return;
    const ws = this.messageService.messageWs;
    if(ws && !this.sendLoading){
      this.sendLoading = true;
      ws.send(
        JSON.stringify({
          type: 'sendMessage',
          from: this.userService.userData?._id,
          to: this.userData?._id,
          content: message,
          ...(this.currentMood ? {
            mood: this.currentMood
          } : {})
        })
      )
    }
  }

  checkOnlineStatus() {
    const ws = this.messageService.messageWs;
    if(ws){
      this.isOnlineLoading = true;
      ws.send(
        JSON.stringify({
          type: 'isOnline',
          userIdWhoIsChecking: this.userService.userData?._id,
          userIdToBeChecked: this.userId
        })
      )
    }
  }

  handleIsOnline(isOnline: boolean) {
    this.isOnline = isOnline;
    this.isOnlineLoading = false;
  }

  handleWebSocketError() {
    this.messageData = [];
    this.error = "some error occured, try again"
  }

  handleWebSocketClose() {
    this.messageData = [];
    this.error = "Network connection lost, try again"
  }

  handleOverallClick(userId: string) {
    this.router.navigateByUrl(`/messages?userId=${userId}`)
  }

  handleGetOverallMessages = (data: OverallMessage[]) => {
    this.overallMessages = data;
    this.overallMessagesLoading = false;
  }

  handleGetMessages = (messageData: Message[]) => {
    this.scrollBehavior = 'auto'
    this.messageData = messageData;
    this.messageDataLoading = false;
  }

  handleSendMessages = (messageData: Message) => {
    this.scrollBehavior = 'smooth'
    this.messageData.push(messageData);
    this.sendLoading = false;
    this.currentMood = null;
    this.message = '';
  }

  handleGetMoods = (moods: Mood[]) => {
    this.moods = moods
  }

  handleCurrentMood (mood: Mood) {
    this.currentMood = mood;
  }

  scroll() {
    const element = this.messagesWrapper.nativeElement;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: this.scrollBehavior
    })
  }

}

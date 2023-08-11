import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MessageService } from 'src/app/services/messages/message.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
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
  initialLength = 0;
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
  searchResults: UserData[] = [];
  showSearchResults = false;
  searchLoading = false;
  selectedMessages: Message[] = [];
  deleteMessagesLoading = false;

  constructor(
    private messageService: MessageService,
    protected userService: UserService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  @ViewChild('messagesWrapper', {static: true}) messagesWrapper!: ElementRef;

  ngOnInit() {
    this.setUpWebSocket();
    this.subscribeToRouterEvents();
  }

  ngAfterViewChecked() {
    if(this.selectedMessages.length > this.initialLength){
      this.initialLength = this.selectedMessages.length;
      return;
    }
    this.scroll()
  }

  setUpWebSocket() {
    // this.messageService.connectMessagesWs()
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
        if(this.messageService.messageWs){
          this.retrieveUserMessages()
        }
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
      this.checkOnlineStatus();
    } else {
      this.messageDataLoading = false;
    }
    this.userDataLoading = true
    if(this.userId){
      this.userService.getUserDetails(this.userId).subscribe((response) => {
        this.userData = response;
        this.userDataLoading = false;
      })
    }
    
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
    if(response.type === 'markSeen') return this.handleMarkseen();
    if(response.type === 'deleteMessages') return this.handleDeleteMessages();
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
    this.retrieveOverallMessages()
    this.scrollBehavior = 'auto'
    this.messageData = messageData;
    this.messageDataLoading = false;
    this.markSeen();
  }

  handleSendMessages = (messageData: Message) => {
    this.retrieveOverallMessages()
    if(messageData.to === this.userService.userData?._id){
      this.markSeen()
    }
    this.scrollBehavior = 'smooth'
    this.messageData.push(messageData);
    this.sendLoading = false;
    this.currentMood = null;
    this.message = '';
  }

  markSeen() {
    const ws = this.messageService.messageWs;
    if(ws){
      ws.send(
        JSON.stringify({
          type: this.markSeen,
          viewedUser: this.userService.userData?._id,
          sendUser: this.userId
        })
      )
    }
  }

  handleMarkseen() {
    for(let i = this.messageData.length - 1; i >= 0; i--){
      if((this.messageData[i].from === this.userService.userData?._id) && this.messageData[i].seen) return;
      if(this.messageData[i].from === this.userService.userData?._id){
        this.messageData[i].seen = true
      }
    }
  }

  handleGetMoods = (moods: Mood[]) => {
    this.moods = moods
  }

  handleCurrentMood (mood: Mood) {
    this.currentMood = mood;
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
    }
  }

  handleSelectMessage(message: Message){
    const index = this.selectedMessages.findIndex(msg => msg._id === message._id);
    if(index !== -1){
      this.selectedMessages.splice(index,1)
    } else {
      this.selectedMessages.push(message)
    }
  }


  isMessageSelected(messageId: string){
    return this.selectedMessages.some(msg => msg._id === messageId)
  }

  deleteMessages(){
    const ws = this.messageService.messageWs;
    if(ws){
      this.deleteMessagesLoading = true
      ws.send(
        JSON.stringify({
          type: 'deleteMessages',
          userId: this.userService.userData?._id,
          messages: this.selectedMessages
        })
      )
    }
  }

  handleDeleteMessages(){
    this.messageData = this.messageData.filter(
      msg => !this.selectedMessages.some(message => message._id === msg._id)
    );
    this.deleteMessagesLoading = false;
    this.selectedMessages = []
  }

  scroll() {
    const element = this.messagesWrapper.nativeElement;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: this.scrollBehavior
    })
  }

}

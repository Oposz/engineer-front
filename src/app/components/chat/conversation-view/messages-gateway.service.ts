import {Injectable, OnDestroy} from '@angular/core';
import {io, Socket} from "socket.io-client";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessagesGatewayService implements OnDestroy {

  fetchNewMessages$: Subject<void> = new Subject();
  updateLastMessagesInChats$: Subject<string> = new Subject();
  private socket: Socket | null = null;
  private isConnected = new BehaviorSubject<boolean>(false);

  public isConnected$ = this.isConnected.asObservable();

  constructor() {
  }

  async connect(userId: string): Promise<boolean> {
    if (this.socket) return true

    return new Promise((resolve, reject) => {
      this.socket = io('http://localhost:3000', {
        transports: ['websocket'],
        autoConnect: true
      });

      this.socket.on('connect', () => {
        this.socket?.emit('authenticate', userId, (response: any) => {
          if (response.status === 'authenticated') {
            this.isConnected.next(true);
            resolve(true);
          } else {
            this.disconnect();
            reject(new Error('Authentication failed'));
          }
        });
      });

      this.setupEventListeners();
    });
  }


  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected.next(true);
    });

    this.socket.on('disconnect', () => {
      this.isConnected.next(false);
    });

    this.socket.on('ping', (data) => {
      console.log('Received ping:', data);
    });
  }

  setupNewMessagesListener() {
    if (!this.socket) return;
    this.socket.on('newMessage', () => {
      this.fetchNewMessages$.next();
    });
  }

  setupNewMessagesInChatListener() {
    if (!this.socket) return;
    this.socket.on('newMessageInChat', (chatId:string) => {
      this.updateLastMessagesInChats$.next(chatId);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected.next(false);
    }
  }

  ngOnDestroy() {
    this.disconnect();
  }

}

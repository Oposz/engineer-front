import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {QuickFiltersComponent, SortingMode} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {NgScrollbar} from "ngx-scrollbar";
import {TeamCardComponent} from "../your-teams/team-card/team-card.component";
import {ChatCardComponent} from "./chat-card/chat-card.component";
import {Chat} from "../../shared/constants/chat";
import {HttpService} from "../../shared/service/http.service";
import {LocalStorageService} from "../../shared/service/local-storage.service";
import {MatDialog} from "@angular/material/dialog";
import {
  CreateNewConversationModalComponent
} from "./create-new-conversation-modal/create-new-conversation-modal.component";
import {MessagesGatewayService} from "./conversation-view/messages-gateway.service";
import {switchMap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

interface ChatToUpdate {
  id: string,
  messages: [{
    content: string,
    userId: string,
    new: boolean,
    chatId: string,
  }]
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    QuickFiltersComponent,
    ViewHeaderComponent,
    NgScrollbar,
    TeamCardComponent,
    ChatCardComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly destroyRef = inject(DestroyRef);

  chats: Chat[] = [];
  filteredChats: Chat[] = [];
  loggedUserId = ''
  searchValue = ''

  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly localStorage: LocalStorageService,
    private readonly messagesGatewayService: MessagesGatewayService
  ) {
  }

  ngOnInit() {
    this.fetchChats();
    this.loggedUserId = this.localStorage.getItem('uniteam-user-id') ?? '';
    this.connectNewMessagesSocket();
    this.observeNewLatestMessagesInChats();
  }

  sortChats(sortingMode: SortingMode) {
    this.chats.sort((a, b) => {
      const getUsersName = (chat: Chat) => {
        return chat.users
          .filter(user => user.id !== this.loggedUserId)
          .map(user => `${user.name} ${user.lastName}`)
          .join(', ');
      };

      const nameA = a.name || getUsersName(a);
      const nameB = b.name || getUsersName(b);

      if (sortingMode === SortingMode.ASCENDING) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    this.changeDetectorRef.detectChanges();
  }

  searchForChat(searchValue: string) {
    if (!searchValue) {
      this.filteredChats = this.chats;
      return;
    }

    this.searchValue = searchValue;
    const searchLower = searchValue.toLowerCase();

    this.filteredChats = this.chats.filter(chat => {
      if (chat.name) {
        return chat.name.includes(searchValue);
      }

      const getUsersName = (chat: Chat) => {
        return chat.users
          .filter(user => user.id !== this.loggedUserId)
          .map(user => `${user.name} ${user.lastName}`.toLowerCase())
          .join(', ');
      };

      const usersName = getUsersName(chat);
      return usersName.includes(searchLower);
    });

    this.changeDetectorRef.detectChanges();
  }

  openModalForNewConversation() {
    this.dialog.open(CreateNewConversationModalComponent, {width: '500px'});
  }

  private fetchChats() {
    this.httpService.get('chats').subscribe((chats: Chat[]) => {
      this.chats = chats;
      this.filteredChats = this.chats;
      this.changeDetectorRef.detectChanges();
    })
  }

  private connectNewMessagesSocket() {
    this.messagesGatewayService.connect(this.loggedUserId).then(
      () => this.messagesGatewayService.setupNewMessagesInChatListener()
    )
  }

  private observeNewLatestMessagesInChats() {
    this.messagesGatewayService.updateLastMessagesInChats$.pipe(
      switchMap((chatId) => this.httpService.get(`chats/new-messages/${chatId}`)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((chat: ChatToUpdate) => {
      this.updateChat(chat)
    })
  }

  private updateChat(chat: ChatToUpdate) {
    const chatToUpdate = this.chats.find((_chat) => (_chat.id === chat.id))
    if (!chatToUpdate) return;
    const chatIndex = this.chats.findIndex((_chat) => _chat.id === chat.id)
    chatToUpdate.messages.push(...chat.messages)
    this.chats.splice(chatIndex, 1);
    this.chats.unshift(chatToUpdate);
    this.searchForChat(this.searchValue);
    this.changeDetectorRef.detectChanges();
  }
}
